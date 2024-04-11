import { readdirSync, statSync } from "fs";
import { join } from "path";
import { ICommand } from "../interfaces/ICommand";
import {
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  Interaction,
  REST,
  Routes,
  Snowflake,
} from "discord.js";
import "dotenv/config";
import { IPermissionCheckResult } from "../interfaces/IPermissionCheckResult";
import { checkPermissions } from "../utils/checkPermissions";
import { MissingPermissionException } from "./MissingPermissionsException";
import { i18n } from "../utils/i18n";

export class EmilyBot {
  public slashCommands = new Array<ApplicationCommandDataResolvable>();
  public slashCommandsMap = new Collection<string, ICommand>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();

  public constructor(public readonly client: Client) {
    this.client.login(process.env.DISCORD_TOKEN);

    this.client.on(Events.ClientReady, (client) => {
      console.log(`${client.user.username} is ready!`);

      this.registerSlashCommands();
    });

    this.client.on(Events.Warn, (info) => {
      console.log(info);
    });

    this.client.on(Events.Error, (error) => {
      console.log(error);
    });

    this.onInteractionCreate();
  }

  private async registerSlashCommands() {
    if (!process.env.DISCORD_TOKEN) {
      console.log(i18n.__("common.noBotToken"));
    } else {
      const rest = new REST({ version: "9" }).setToken(
        process.env.DISCORD_TOKEN
      );

      const commandFiles = readdirSync(join(__dirname, "..", "commands"))
        .flatMap((folder) => {
          const folderPath = join(__dirname, "..", "commands", folder);
          return readdirSync(folderPath)
            .filter((file) => !file.endsWith(".map"))
            .map((file) => join(folderPath, file));
        })
        .filter((filePath) => statSync(filePath).isFile());

      for (const file of commandFiles) {
        const command = await import(file);

        this.slashCommands.push(command.default.data);
        this.slashCommandsMap.set(command.default.data.name, command.default);
      }

      await rest.put(Routes.applicationCommands(this.client.user!.id), {
        body: this.slashCommands,
      });
    }
  }

  private async onInteractionCreate() {
    const now = Date.now();

    this.client.on(Events.InteractionCreate, async (interaction: Interaction): Promise<any> => {
      if (!interaction.isChatInputCommand()) return;
      const command = this.slashCommandsMap.get(interaction.commandName);

      if (!command) return;

      if (!this.cooldowns.has(interaction.commandName)) {
        this.cooldowns.set(interaction.commandName, new Collection());
      }

      const timestamps = this.cooldowns.get(interaction.commandName)!;
      const cooldownDuration = (command.cooldown || 1) * 1000;
      const timestamp = timestamps.get(interaction.user.id);

      if (timestamp) {
        const expirationTime = timestamp + cooldownDuration;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({
            content: i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: interaction.commandName }),
            ephemeral: true
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownDuration);

      try {
        const permissionsCheck: IPermissionCheckResult = await checkPermissions(command, interaction);

        if (permissionsCheck.result) {
          command.execute(interaction as ChatInputCommandInteraction);
        } else {
          throw new MissingPermissionException(permissionsCheck.missingPermissions);
        }
      } catch (error: any) {
        console.error(error);

        if (error.message.includes("permissions")) {
          interaction.reply({ content: error.toString(), ephemeral: true }).catch(console.error);
        } else {
          interaction.reply({ content: "There was an error executing that command.", ephemeral: true }).catch(console.error);
        }
      }
    });
  }
}
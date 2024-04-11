import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { i18n } from "../../utils/i18n";

export default {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setDMPermission(true)
    .setName("ping")
    .setDescription(
      i18n.__("ping.description")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction
      .reply({
        content: i18n.__mf("ping.response", { ping: Math.round(interaction.client.ws.ping) }),
        ephemeral: true
      })
      .catch(console.error);
  },
};

import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { emilyDb } from "../../classes/EmilyBot";
import { i18n } from "../../utils/i18n";

export default {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setName("language")
    .setDescription(i18n.__("language.description"))
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("The language you would like to use with Emily")
        .addChoices(
          { name: "English", value: "en" },
          { name: "Deustche", value: "de" }
        )
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    let localization = interaction.options.getString("language");
    const guildId = interaction.guildId;
    const localizationCollection = emilyDb.collection("localizations");

    // Check if there's already a localization for the guild
    const existingLocalization = await localizationCollection.findOne({
      guildId: guildId,
    });

    if (existingLocalization) {
      // Update existing localization
      await localizationCollection.updateOne(
        { guildId: guildId },
        { $set: { language: localization } }
      );
      await interaction.reply({
        content: i18n.__mf("language.response", { lang: localization }),
        ephemeral: true,
      });
    } else {
      // Create new localization
      await localizationCollection.insertOne({
        guildId: guildId,
        language: localization,
      });
      await interaction.reply({
        content: i18n.__mf("language.response", { lang: localization }),
        ephemeral: true,
      });
    }
  },
};

import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { i18n } from "../../utils/i18n";
import interact from '../../assets/interaction.json';
import fs from "fs";
import path from "path";

export default {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.EmbedLinks)
    .setName("pat")
    .setDescription(i18n.__("pat.description"))
    .addUserOption((option) => option.setName("user").setDescription(i18n.__("pat.option1")).setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember("user");
    const pattedUser = interaction.options.getUser("user");

    if (!user) {
      return await interaction.reply({ content: i18n.__mf("pat.userNotExist", { pattedId: user }), ephemeral: true });
    } else if (interaction.user.id === pattedUser!.id) {
      
    }

    const randomGif = Math.floor(Math.random() * interact.pat.length);

    const replyEmbed = new EmbedBuilder()
      .setColor("#f03e88")
      .setDescription(i18n.__mf("pat.response", { patterId: executorId, pattedId: pattedId }))
      .setImage(interact.pat[randomGif])

    await interaction.reply({ embeds: [replyEmbed] });
  }
};

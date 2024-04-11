import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong"),
  async execute (interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: "Pong!", ephemeral: true });
  }
}
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong! Test Emily's response time and make sure she's online."),
  async execute (interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: `Pong!\nResponse time: ${Math.round(interaction.client.ws.ping)}ms`, ephemeral: true }).catch(console.error);
  }
}
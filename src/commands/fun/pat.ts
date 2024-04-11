import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { i18n } from "../../utils/i18n";
import { emilyId } from "../../classes/EmilyBot";
import interact from '../../assets/interaction.json';

export default {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.EmbedLinks)
    .setName("pat")
    .setDescription(i18n.__("pat.description"))
    .addUserOption((option) => option.setName("user").setDescription(i18n.__("pat.option1")).setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getMember("user");
    const victim = interaction.options.getUser("user")!.id; // Option is required, never null
    const executor = interaction.user.id;
    const randomGif = interact.pat[Math.floor(Math.random() * interact.pat.length)];

    if (victim === executor) {
      return interaction.reply({ content: i18n.__mf("pat.cantpatYourself", { executor: executor }) });
    } else if (victim === emilyId) {
      return interaction.reply({ content: i18n.__mf("pat.cantpatBot"), files: [{ attachment: interact.run[0], name: "runAway.gif" }] })
    } else if (!member) {
      return interaction.reply({ content: i18n.__mf("pat.userNotExist", {victim: victim} ), ephemeral: true });
    }

    const replyEmbed = new EmbedBuilder()
      .setDescription(i18n.__mf("pat.response", { executor: executor, victim: victim }))
      .setImage(randomGif);

    return interaction.editReply({ embeds: [replyEmbed] });
  }
};

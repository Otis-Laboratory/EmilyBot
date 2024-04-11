import { ChatInputCommandInteraction, PermissionResolvable } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { IPermissionCheckResult } from "../interfaces/IPermissionCheckResult";

export async function checkPermissions(command: ICommand, interaction: ChatInputCommandInteraction): Promise<IPermissionCheckResult> {
  const member = await interaction.guild!.members.fetch({ user: interaction.client.user!.id });
  const commandPermissions = command.permissions as PermissionResolvable[];

  if (!command.permissions) return { result: true, missingPermissions: [] };

  const missingPermissions = member.permissions.missing(commandPermissions);

  return { result: !Boolean(missingPermissions?.length), missingPermissions };
};
import { LargeNumberLike } from "crypto";
import { SlashCommandBuilder } from "discord.js";

export interface ICommand {
  permissions?: string[];
  cooldown?: number;
  data: SlashCommandBuilder;
  execute(...args: any): any; 
}
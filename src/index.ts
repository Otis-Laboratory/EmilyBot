import { Client, GatewayIntentBits } from "discord.js";
import { EmilyBot } from "./classes/EmilyBot";

export const bot = new EmilyBot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ]
  })
);
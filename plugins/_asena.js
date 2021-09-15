/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events");
const Config = require("../config");
const { lydia, getLydia, setLydia } = require("../Utilis/lydia");
const { getName } = require("../Utilis/download");
const Language = require("../language");
const Lang = Language.getString("_asena");
Asena.addCommand(
  { pattern: "list ?(.*)", fromMe: true, dontAddCommandList: true },
  async (message, match) => {
    let CMD_HELP = "";
    Asena.commands.map(async (command, index) => {
      if (
        command.dontAddCommandList === false &&
        command.pattern !== undefined
      ) {
        try {
          var match = command.pattern
            .toString()
            .match(/(\W*)([A-Za-z0-9ğüşiöç]*)/);
        } catch {
          var match = [command.pattern];
        }

        let HANDLER = "";

        if (/\[(\W*)\]/.test(Config.HANDLERS)) {
          HANDLER = Config.HANDLERS.match(/\[(\W*)\]/)[1][0];
        } else {
          HANDLER = ".";
        }
        CMD_HELP += `${index} ${match.length >= 3 ? HANDLER + match[2] : command.pattern
          }\n${command.desc}\n\n`;
      }
    });
    return await message.sendMessage("```" + CMD_HELP + "```");
  }
);

Asena.addCommand(
  {
    pattern: "lydia ?(.*)",
    fromMe: true,
    desc: Lang.DESC
  },
  async (message, match) => {
    let jid = message.isGroup
      ? message.reply_message == false && message.mention == false
        ? message.jid
        : !message.reply_message
          ? message.mention[0]
          : message.reply_message.jid
      : message.jid;
    if (match.startsWith("stop")) {
      let chat = await getLydia(jid);
      if (!chat)
        return await message.sendMessage(
          Lang.L_NOT_ACTIVATED.format(await getName(jid, message.client))
        );
      await setLydia(jid, false);
      return await message.sendMessage(
        Lang.L_DEACTIVATED.format(await getName(jid, message.client))
      );
    }
    await setLydia(jid, true);
    return await message.sendMessage(
      Lang.L_ACTIVATED.format(await getName(jid, message.client))
    );
  }
);

Asena.addCommand({ on: "text", fromMe: false }, async (message, match) => {
  let chat = await lydia(message);
  if (!chat) return;
  return await message.sendMessage(chat, { quoted: message.data });
});

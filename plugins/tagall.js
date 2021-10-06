/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events");
const Language = require("../language");
const { participateInVote, parseVote } = require("../Utilis/vote");
const { forwardOrBroadCast } = require("../Utilis/groupmute");
const Lang = Language.getString("tagall");
// const config = require('../config');
Asena.addCommand(
  {
    pattern: "tag ?(.*)",
    fromMe: true,
    onlyGroup: true,
    desc: Lang.TAGALL_DESC,
  },
  async (message, match) => {
    let participants = await message.groupMetadata(message.jid);
    let mentionedJid = participants.map((user) => user.jid);
    if (match == "all") {
      let mesaj = "";
      mentionedJid.forEach((e) => (mesaj += `@${e.split("@")[0]}\n`));
      return await message.sendMessage(mesaj, {
        contextInfo: { mentionedJid },
      });
    } else if (match == "admin") {
      let mesaj = "";
      let mentionedJid = participants
        .filter((user) => user.isAdmin == true)
        .map((user) => user.jid);
      mentionedJid.forEach((e) => (mesaj += `@${e.split("@")[0]}\n`));
      return await message.sendMessage(mesaj, {
        contextInfo: { mentionedJid },
      });
    } else if (match == "notadmin") {
      let mesaj = "";
      let mentionedJid = participants
        .filter((user) => user.isAdmin != true)
        .map((user) => user.jid);
      mentionedJid.forEach((e) => (mesaj += `@${e.split("@")[0]}\n`));
      return await message.sendMessage(mesaj, {
        contextInfo: { mentionedJid },
      });
    }
    if (!message.reply_message)
      return await message.sendMessage("*Reply to a message*");
    forwardOrBroadCast(message.jid, message, { contextInfo: { mentionedJid } });
  }
);

Asena.addCommand(
  { pattern: "vote ?(.*)", fromMe: true, desc: Lang.VOTE_DESC },
  async (message, match) => {
    let { msg, options, type } = await parseVote(message, match);
    return await message.sendMessage(msg, options, type);
  }
);
Asena.addCommand({ on: "vote", fromMe: false }, async (message, match) => {
  let msg = await participateInVote(message);
  if (!msg) return;
  return await message.sendMessage(msg, { quoted: message.data });
});

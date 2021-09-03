/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events");
// const { MessageType } = require('@adiwajshing/baileys');
const sql = require("./sql/greetings");
const Language = require("../language");
const Lang = Language.getString("greetings");
// const config = require('../config');
let fm = true;
Asena.addCommand(
  {
    pattern: "welcome$",
    fromMe: fm,
    dontAddCommandList: true,
    desc: Lang.WELCOME_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await sql.getMessage(message.jid);
    if (hg === false) return await message.sendMessage(Lang.NOT_SET_WELCOME);
    return await message.sendMessage(
      Lang.WELCOME_ALREADY_SETTED + hg.message + "```"
    );
  }
);

Asena.addCommand(
  {
    pattern: "welcome (.*)",
    fromMe: fm,
    desc: Lang.WELCOME_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT);
    if (match === "delete") {
      await message.sendMessage(Lang.WELCOME_DELETED);
      return await sql.deleteMessage(message.jid, "welcome");
    }
    await sql.setMessage(message.jid, "welcome", match);
    return await message.sendMessage(Lang.WELCOME_SETTED);
  }
);

Asena.addCommand(
  {
    pattern: "goodbye$",
    fromMe: fm,
    dontAddCommandList: true,
    desc: Lang.GOODBYE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await sql.getMessage(message.jid, "goodbye");
    if (hg === false) return await message.sendMessage(Lang.NOT_SET_GOODBYE);
    return await message.sendMessage(
      Lang.GOODBYE_ALREADY_SETTED + hg.message + "```"
    );
  }
);

Asena.addCommand(
  {
    pattern: "goodbye (.*)",
    fromMe: fm,
    desc: Lang.GOODBYE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_GOODBYE_TEXT);
    if (match === "delete") {
      await message.sendMessage(Lang.GOODBYE_DELETED);
      return await sql.deleteMessage(message.jid, "goodbye");
    }
    await sql.setMessage(message.jid, "goodbye", match);
    return await message.sendMessage(Lang.GOODBYE_SETTED);
  }
);

Asena.addCommand(
  {
    pattern: "banbye$",
    fromMe: fm,
    dontAddCommandList: true,
    onlyGroup: true,
    desc: Lang.GOODBYE_DESC,
  },
  async (message, match) => {
    let hg = await sql.getMessage(message.jid, "banbye");
    if (hg === false) return await message.sendMessage(Lang.NOT_SET_GOODBYE);
    return await message.sendMessage(
      Lang.GOODBYE_ALREADY_SETTED + hg.message + "```"
    );
  }
);

Asena.addCommand(
  {
    pattern: "banbye (.*)",
    fromMe: fm,
    onlyGroup: true,
    desc: Lang.GOODBYE_DESC,
  },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_GOODBYE_TEXT);
    if (match === "delete") {
      await message.sendMessage(Lang.GOODBYE_DELETED);
      return await sql.deleteMessage(message.jid, "banbye");
    }
    await sql.setMessage(message.jid, "banbye", match);
    return await message.sendMessage(Lang.GOODBYE_SETTED);
  }
);

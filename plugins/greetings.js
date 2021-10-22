/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events");
const Language = require("../language");
const {
  setMsg,
  enableGreetings,
  genButtons,
  genGreetingsPreView,
  enableAntilink,
  isUrl,
  enableAntiFake,
  enableAntiBad,
} = require("../Utilis/Misc");
const { MessageType } = require("@adiwajshing/baileys");
const { getMessage, deleteMessage } = require("../Utilis/warn");
const Lang = Language.getString("greetings");
// const config = require('../config');
let fm = true;

Asena.addCommand(
  {
    pattern: "welcome ?(.*)",
    fromMe: fm,
    desc: Lang.WELCOME_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await getMessage(message.jid, "welcome");
    if (hg === false && match === "")
      return await message.sendMessage(Lang.NOT_SET_WELCOME);
    if (hg !== false && match === "") {
      await message.sendMessage(
        Lang.WELCOME_ALREADY_SETTED + hg.message + "```"
      );
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Welcome Message", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    }
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT);
    else if (match == "on" || match == "off") {
      enableGreetings(message.jid, "welcome", match);
      return await message.sendMessage(
        `*✅Welcome Message ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    } else if (match === "delete") {
      await message.sendMessage(Lang.WELCOME_DELETED);
      return await deleteMessage(message.jid, "welcome");
    }
    setMsg(message.jid, "welcome", match);
    await message.sendMessage(Lang.WELCOME_SETTED);
    genGreetingsPreView(message);
  }
);

Asena.addCommand(
  {
    pattern: "goodbye ?(.*)",
    fromMe: fm,
    desc: Lang.GOODBYE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await getMessage(message.jid, "goodbye");
    if (hg === false && match === "")
      return await message.sendMessage(Lang.NOT_SET_GOODBYE);
    if (hg !== false && match === "") {
      await message.sendMessage(
        Lang.GOODBYE_ALREADY_SETTED + hg.message + "```"
      );
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Goodbye Message", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    }
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT);
    else if (match == "on" || match == "off") {
      enableGreetings(message.jid, "goodbye", match);
      return await message.sendMessage(
        `*✅Goodbye Message ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    } else if (match === "delete") {
      await message.sendMessage(Lang.GOODBYE_DELETED);
      return await deleteMessage(message.jid, "goodbye");
    }
    setMsg(message.jid, "goodbye", match);
    await message.sendMessage(Lang.GOODBYE_SETTED);
    genGreetingsPreView(message);
  }
);

Asena.addCommand(
  {
    pattern: "banbye ?(.*)",
    fromMe: fm,
    desc: Lang.GOODBYE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await getMessage(message.jid, "banbye");
    if (hg === false && match === "")
      return await message.sendMessage(Lang.NOT_SET_GOODBYE);
    if (hg !== false && match === "") {
      await message.sendMessage(
        Lang.GOODBYE_ALREADY_SETTED + hg.message + "```"
      );
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Banbye Message", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    }
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT);
    else if (match == "on" || match == "off") {
      enableGreetings(message.jid, "banbye", match);
      return await message.sendMessage(
        `*✅Banbye Message ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    } else if (match === "delete") {
      await message.sendMessage(Lang.GOODBYE_DELETED);
      return await deleteMessage(message.jid, "banbye");
    }
    setMsg(message.jid, "banbye", match);
    await message.sendMessage(Lang.GOODBYE_SETTED);
    genGreetingsPreView(message);
  }
);

Asena.addCommand(
  {
    pattern: "antilink ?(.*)",
    fromMe: true,
    desc: "To enable to disable antilink\nTo on or off\n.antilink on\nTo allow urls\n.antilink instagram.com,fb.com,youtube.com",
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Anti link Here", "Choose"),
        {},
        MessageType.buttonsMessage
      );

    if (match == "on" || match == "off") {
      enableAntilink(message.jid, match);
      return await message.sendMessage(
        `*✅Antilink ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    }
    enableAntilink(message.jid, match);
    return await message.sendMessage("```Updated```");
  }
);

Asena.addCommand(
  {
    pattern: "antifake ?(.*)",
    fromMe: true,
    desc: "To enable to disable antifake\nTo on or off\n.antifake on\nTo choose county code\n.antifake 1,44,994",
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Anti Fake Here", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    if (match == "on" || match == "off") {
      enableAntiFake(message.jid, match);
      return await message.sendMessage(
        `*✅Antifake ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    }
    enableAntiFake(message.jid, match);
    return await message.sendMessage("```Updated```");
  }
);

Asena.addCommand(
  {
    pattern: "antibad ?(.*)",
    fromMe: true,
    desc: "To enable to disable antibad\nTo on or off\n.antibad on\nTo add words\n.antibad word1,word2,word3",
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Anti Bad Here", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    if (match == "on" || match == "off") {
      enableAntiBad(message.jid, match);
      return await message.sendMessage(
        `*✅AntiBad ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    }
    enableAntiBad(message.jid, match);
    return await message.sendMessage("```Updated```");
  }
);

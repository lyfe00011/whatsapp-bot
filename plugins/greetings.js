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
  enableAntiFake,
  enableAntiBad,
  checkImAdmin,
  antiList,
  clearGreetings,
} = require("../Utilis/Misc");
const { MessageType } = require("@adiwajshing/baileys");
const { getMessage, deleteMessage } = require("../Utilis/warn");
const Lang = Language.getString("greetings");
const Lang1 = Language.getString("admin");
// const config = require('../config');
let fm = true;
const s = "```";
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
      await enableGreetings(message.jid, "welcome", match);
      return await message.sendMessage(
        `*✅Welcome Message ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    } else if (match === "delete") {
      await message.sendMessage(Lang.WELCOME_DELETED);
      clearGreetings(message.jid, 'welcome')
      return await deleteMessage(message.jid, "welcome");
    }
    await setMsg(message.jid, "welcome", match);
    await genGreetingsPreView(message);
    return await message.sendMessage(Lang.WELCOME_SETTED);
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
      await message.sendMessage(Lang.GOODBYE_ALREADY_SETTED + hg.message + s);
      return await message.sendMessage(
        genButtons(["ON", "OFF"], "To ON or OFF Goodbye Message", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    }
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT);
    else if (match == "on" || match == "off") {
      await enableGreetings(message.jid, "goodbye", match);
      return await message.sendMessage(
        `*✅Goodbye Message ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    } else if (match === "delete") {
      clearGreetings(message.jid, 'goodbye')
      await message.sendMessage(Lang.GOODBYE_DELETED);
      return await deleteMessage(message.jid, "goodbye");
    }
    await setMsg(message.jid, "goodbye", match);
    await genGreetingsPreView(message);
    return await message.sendMessage(Lang.GOODBYE_SETTED);
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
      await message.sendMessage(Lang.GOODBYE_ALREADY_SETTED + hg.message + s);
      return await message.sendMessage(
        genButtons(
          ["ON", "OFF", "LIST"],
          "To ON or OFF Banbye Message",
          "Choose"
        ),
        {},
        MessageType.buttonsMessage
      );
    }
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT);
    else if (match == "on" || match == "off") {
      await enableGreetings(message.jid, "banbye", match);
      return await message.sendMessage(
        `*✅Banbye Message ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    } else if (match === "delete") {
      clearGreetings(message.jid, 'banbye')
      await message.sendMessage(Lang.GOODBYE_DELETED);
      return await deleteMessage(message.jid, "banbye");
    }
    await setMsg(message.jid, "banbye", match);
    await genGreetingsPreView(message);
    return await message.sendMessage(Lang.GOODBYE_SETTED);
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
        genButtons(
          ["ON", "OFF", "LIST"],
          "To ON or OFF Anti link Here",
          "Choose"
        ),
        {},
        MessageType.buttonsMessage
      );
    if (match == "list") {
      let list = "";
      let urls = await antiList(message.jid, 'link');
      if (!urls) return await message.sendMessage("*Anti link not Enbaled*");
      urls.forEach((url, i) => {
        list += `${i + 1}. ${url}\n`;
      });
      return await message.sendMessage(s + list + s);
    } else if (match == "on" || match == "off") {
      let participants = await message.groupMetadata(message.jid);
      let im = await checkImAdmin(participants, message.client.user.jid);
      if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN);
      await enableAntilink(message.jid, match);
      return await message.sendMessage(
        `*✅Antilink ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    }
    await enableAntilink(message.jid, match);
    return await message.sendMessage(`${s}Antilink Updated${s}`);
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
        genButtons(
          ["ON", "OFF", "LIST"],
          "To ON or OFF Anti Fake Here",
          "Choose"
        ),
        {},
        MessageType.buttonsMessage
      );
    if (match == "list") {
      let list = "";
      let codes = await antiList(message.jid, 'fake');
      if (!codes) return await message.sendMessage("*Anti Fake not Enbaled*");
      codes.forEach((code, i) => {
        list += `${i + 1}. ${code}\n`;
      });
      return await message.sendMessage(s + list + s);
    } else if (match == "on" || match == "off") {
      let participants = await message.groupMetadata(message.jid);
      let im = await checkImAdmin(participants, message.client.user.jid);
      if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN);
      await enableAntiFake(message.jid, match);
      return await message.sendMessage(
        `*✅Antifake ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    }
    await enableAntiFake(message.jid, match);
    return await message.sendMessage(`${s}AntiFake Updated${s}`);
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
        genButtons(["ON", "OFF", "LIST"], "To ON or OFF Anti Bad Here", "Choose"),
        {},
        MessageType.buttonsMessage
      );
    if (match == "list") {
      let list = "";
      let words = await antiList(message.jid, 'bad');
      if (!words) return await message.sendMessage("*Anti Bad not Enbaled*");
      words.forEach((word, i) => {
        list += `${i + 1}. ${word}\n`;
      });
      return await message.sendMessage(s + list + s);
    } else if (match == "on" || match == "off") {
      let participants = await message.groupMetadata(message.jid);
      let im = await checkImAdmin(participants, message.client.user.jid);
      if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN);
      await enableAntiBad(message.jid, match);
      return await message.sendMessage(
        `*✅AntiBad ${match == "on" ? "Enabled" : "Disabled"}*`
      );
    }
    await enableAntiBad(message.jid, match);
    return await message.sendMessage(`${s}AntiBad Updated${s}`);
  }
);

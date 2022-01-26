/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const Language = require("../language")
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
  mentionMessage,
  enableMention,
} = require("../Utilis/Misc")
const { MessageType } = require("@adiwajshing/baileys")
const { getMessage, deleteMessage } = require("../Utilis/warn")
const Lang = Language.getString("greetings")
const Lang1 = Language.getString("admin")
// const config = require('../config');
let fm = true
const s = "```"
Asena.addCommand(
  {
    pattern: "welcome ?(.*)",
    fromMe: fm,
    desc: Lang.WELCOME_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await getMessage(message.jid, "welcome")
    if (hg === false && match === "")
      return await message.sendMessage(Lang.NOT_SET_WELCOME)
    if (hg !== false && match === "") {
      await message.sendMessage(
        Lang.WELCOME_ALREADY_SETTED + hg.message + "```"
      )
      return await message.sendMessage(
        genButtons(["ON", "OFF"], Lang.ON_OFF.format("Welcome"), "Choose"),
        {},
        MessageType.buttonsMessage
      )
    }
    if (match === "") return await message.sendMessage(Lang.NEED_WELCOME_TEXT)
    else if (match == "on" || match == "off") {
      await enableGreetings(message.jid, "welcome", match)
      return await message.sendMessage(
        Lang.W_ENABLED.format(match == "on" ? Lang.ENABLE : Lang.DISABLE)
      )
    } else if (match === "delete") {
      await message.sendMessage(Lang.WELCOME_DELETED)
      clearGreetings(message.jid, "welcome")
      return await deleteMessage(message.jid, "welcome")
    }
    await setMsg(message.jid, "welcome", match)
    await genGreetingsPreView(message)
    return await message.sendMessage(Lang.WELCOME_SETTED)
  }
)

Asena.addCommand(
  {
    pattern: "goodbye ?(.*)",
    fromMe: fm,
    desc: Lang.GOODBYE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await getMessage(message.jid, "goodbye")
    if (hg === false && match === "")
      return await message.sendMessage(Lang.NOT_SET_GOODBYE)
    if (hg !== false && match === "") {
      await message.sendMessage(Lang.GOODBYE_ALREADY_SETTED + hg.message + s)
      return await message.sendMessage(
        genButtons(["ON", "OFF"], Lang.ON_OFF.format("GoodBye"), "Choose"),
        {},
        MessageType.buttonsMessage
      )
    }
    if (match === "") return await message.sendMessage(Lang.NEED_GOODBYE_TEXT)
    else if (match == "on" || match == "off") {
      await enableGreetings(message.jid, "goodbye", match)
      return await message.sendMessage(
        Lang.G_ENABLED.format(match == "on" ? Lang.ENABLE : Lang.DISABLE)
      )
    } else if (match === "delete") {
      clearGreetings(message.jid, "goodbye")
      await message.sendMessage(Lang.GOODBYE_DELETED)
      return await deleteMessage(message.jid, "goodbye")
    }
    await setMsg(message.jid, "goodbye", match)
    await genGreetingsPreView(message)
    return await message.sendMessage(Lang.GOODBYE_SETTED)
  }
)

Asena.addCommand(
  {
    pattern: "banbye ?(.*)",
    fromMe: fm,
    desc: Lang.BANBYE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    let hg = await getMessage(message.jid, "banbye")
    if (hg === false && match === "")
      return await message.sendMessage(Lang.NOT_SET_BANBYE)
    if (hg !== false && match === "") {
      await message.sendMessage(Lang.BANBYE_ALREADY_SETTED + hg.message + s)
      return await message.sendMessage(
        genButtons(["ON", "OFF"], Lang.ON_OFF.format("Banbye"), "Choose"),
        {},
        MessageType.buttonsMessage
      )
    }
    if (match === "") return await message.sendMessage(Lang.NEED_BANBYE_TEXT)
    else if (match == "on" || match == "off") {
      await enableGreetings(message.jid, "banbye", match)
      return await message.sendMessage(
        Lang.B_ENABLED.format(match == "on" ? Lang.ENABLE : Lang.DISABLE)
      )
    } else if (match === "delete") {
      clearGreetings(message.jid, "banbye")
      await message.sendMessage(Lang.BANBYE_DELETED)
      return await deleteMessage(message.jid, "banbye")
    }
    await setMsg(message.jid, "banbye", match)
    await genGreetingsPreView(message)
    return await message.sendMessage(Lang.BANBYE_SETTED)
  }
)

Asena.addCommand(
  {
    pattern: "antilink ?(.*)",
    fromMe: true,
    desc: Lang.ANTILINK_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(
          ["ON", "OFF", "LIST"],
          Lang.A_ON_OFF.format("Antilink"),
          "Choose"
        ),
        {},
        MessageType.buttonsMessage
      )
    let participants = await message.groupMetadata(message.jid)
    let im = await checkImAdmin(participants, message.client.user.jid)
    if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN)
    if (match == "list") {
      let list = ""
      let urls = await antiList(message.jid, "link")
      if (!urls)
        return await message.sendMessage(Lang.NOT_ENABLED.format("Antilink"))
      urls.forEach((url, i) => {
        list += `${i + 1}. ${url}\n`
      })
      return await message.sendMessage(s + list + s)
    } else if (match == "on" || match == "off") {
      await enableAntilink(message.jid, match)
      return await message.sendMessage(
        Lang.A_ENABLED.format(
          "Antilink",
          `${match == "on" ? Lang.ENABLE : Lang.DISABLE}`
        )
      )
    }
    await enableAntilink(message.jid, match)
    return await message.sendMessage(Lang.A_UPDATED.format("Antilink"))
  }
)

Asena.addCommand(
  {
    pattern: "antifake ?(.*)",
    fromMe: true,
    desc: Lang.ANTIFAKE_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(
          ["ON", "OFF", "LIST"],
          Lang.A_ON_OFF.format("Antifake"),
          "Choose"
        ),
        {},
        MessageType.buttonsMessage
      )
    let participants = await message.groupMetadata(message.jid)
    let im = await checkImAdmin(participants, message.client.user.jid)
    if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN)
    if (match == "list") {
      let list = ""
      let codes = await antiList(message.jid, "fake")
      if (!codes)
        return await message.sendMessage(Lang.NOT_ENABLED.format("Antifake"))
      codes.forEach((code, i) => {
        list += `${i + 1}. ${code}\n`
      })
      return await message.sendMessage(s + list + s)
    } else if (match == "on" || match == "off") {
      await enableAntiFake(message.jid, match)
      return await message.sendMessage(
        Lang.A_ENABLED.format(
          "AntiFake",
          `${match == "on" ? Lang.ENABLE : Lang.DISABLE}`
        )
      )
    }
    await enableAntiFake(message.jid, match)
    return await message.sendMessage(Lang.A_UPDATED.format("Antifake"))
  }
)

Asena.addCommand(
  {
    pattern: "antibad ?(.*)",
    fromMe: true,
    desc: Lang.ANTIBAD_DESC,
    onlyGroup: true,
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(
          ["ON", "OFF", "LIST"],
          Lang.A_ON_OFF.format("Antibad"),
          "Choose"
        ),
        {},
        MessageType.buttonsMessage
      )
    let participants = await message.groupMetadata(message.jid)
    let im = await checkImAdmin(participants, message.client.user.jid)
    if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN)
    if (match == "list") {
      let list = ""
      let words = await antiList(message.jid, "bad")
      if (!words)
        return await message.sendMessage(Lang.NOT_ENABLED.format("Antibad"))
      words.forEach((word, i) => {
        list += `${i + 1}. ${word}\n`
      })
      return await message.sendMessage(s + list + s)
    } else if (match == "on" || match == "off") {
      await enableAntiBad(message.jid, match)
      return await message.sendMessage(
        Lang.A_ENABLED.format(
          "AntiBad",
          `${match == "on" ? Lang.ENABLE : Lang.DISABLE}`
        )
      )
    }
    await enableAntiBad(message.jid, match)
    return await message.sendMessage(Lang.A_UPDATED.format("Antibad"))
  }
)

Asena.addCommand(
  {
    pattern: "mention ?(.*)",
    fromMe: true,
    desc: Lang.MENTION_DESC,
  },
  async (message, match) => {
    if (match == "")
      return await message.sendMessage(
        genButtons(["ON", "OFF", "GET"], Lang.M_ENABLE, "Choose"),
        {},
        MessageType.buttonsMessage
      )
    if (match == "get") {
      let msg = await mentionMessage()
      if (!msg)
        return await message.sendMessage(Lang.NOT_ENABLED.format("Mention"))
      return await message.sendMessage(msg)
    } else if (match == "on" || match == "off") {
      await enableMention(match)
      return await message.sendMessage(
        Lang.A_ENABLED.format(
          "Reply to Mention",
          `${match == "on" ? Lang.ENABLE : Lang.DISABLE}`
        )
      )
    }
    await enableMention(match)
    return await message.sendMessage(Lang.A_UPDATED.format("Mention"))
  }
)

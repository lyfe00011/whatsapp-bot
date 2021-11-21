/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const { spawnSync } = require("child_process")
const Config = require("../config")
const Language = require("../language")
const { checkImAdmin, aliveMessage, removeUrl } = require("../Utilis/Misc")
const { warn, getEachWarn } = require("../Utilis/warn")
const { MessageType } = require("@adiwajshing/baileys")
const Lang = Language.getString("system_stats")
let fm = true

Asena.addCommand(
  { pattern: "alive ?(.*)", fromMe: fm, desc: Lang.ALIVE_DESC },
  async (message, match) => {
    let { buffer, type, msg } = await aliveMessage(match)
    if (type == "text") return await message.sendMessage(msg)
    else if (type == "image")
      return await message.sendMessage(
        buffer,
        { caption: msg },
        MessageType.image
      )
    else if (type == "video")
      return await message.sendMessage(
        buffer,
        { caption: msg },
        MessageType.video
      )
  }
)

Asena.addCommand(
  { pattern: "sysd", fromMe: true, desc: Lang.SYSD_DESC },
  async (message, match) => {
    const child = spawnSync("neofetch", ["--stdout"]).stdout.toString("utf-8")
    await message.sendMessage("```" + child + "```")
  }
)

Asena.addCommand(
  { pattern: "warn ?(.*)", fromMe: fm, desc: "To warn", onlyGroup: true },
  async (message, match) => {
    if (match == "list") {
      let msg = ""
      let users = await getEachWarn()
      if (!users) return await message.sendMessage("*Nothing to Display*")
      users.forEach((jid) => {
        let { user, count, reason } = jid
        msg += Lang.WARN_MSG.format(
          user.split("@")[0],
          count,
          Config.WARN_COUNT - count,
          removeUrl(reason)
        )
      })
      return await message.sendMessage(msg)
    }
    if (!message.reply_message && !message.mention)
      return await message.sendMessage(Lang.NEED_USER)
    let quoted = !message.reply_message ? undefined : message.quoted
    let { user, count, reason } = await warn(message, match)
    if (reason == "reset") {
      return await message.sendMessage(
        Lang.RESET.format(user.split("@")[0], Config.WARN_COUNT - count),
        { quoted, contextInfo: { mentionedJid: [user] } }
      )
    }
    if (count >= Config.WARN_COUNT) {
      let participants = await message.groupMetadata(message.jid)
      let im = await checkImAdmin(participants, message.client.user.jid)
      if (!im) return await message.sendMessage(Lang.IAADMIN)
      let us = await checkImAdmin(participants, user)
      if (us) return await message.sendMessage(Lang.ISADMIN)
      await message.sendMessage(Config.WARN_MSG, { quoted })
      return await message.groupRemove(message.jid, user)
    }
    return await message.sendMessage(
      Lang.WARNING.format(
        user.split("@")[0],
        removeUrl(reason),
        Config.WARN_COUNT - count
      ),
      { quoted, contextInfo: { mentionedJid: [user] } }
    )
  }
)

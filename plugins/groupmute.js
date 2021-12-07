const Asena = require("../Utilis/events")
const {
  getMute,
  setMute,
  getUnmute,
  setUnmute,
  getEachUnmute,
  getEachMute,
} = require("../Utilis/groupmute")
const Language = require("../language")
const { isGroup, checkImAdmin } = require("../Utilis/Misc")
const Lang = Language.getString("groupmute")
const Lang1 = Language.getString("admin")
Asena.addCommand(
  {
    pattern: "automute ?(.*)",
    fromMe: true,
    desc: Lang.AUTOMUTE_DESC,
  },
  async (message, match) => {
    let participants = await message.groupMetadata(message.jid)
    let im = await checkImAdmin(participants, message.client.user.jid)
    if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN)
    if (match == "" && !message.reply_message) {
      return await message.sendMessage(Lang.MUTE_NEED_REPLY)
    }
    let msg = message.reply_message.text || "false"
    let [user, hours, minute] = match.split(" ")
    if (user == "list") {
      let all = await getEachMute()
      if (!all) return await message.sendMessage(Lang.NO_SCHEDULE)
      let msg = ""
      all.forEach((jids) => {
        let { jid, message, hour, minute, onoroff } = jids
        msg += Lang.SCHEDULE_MSG.format(jid, message, hour, minute, onoroff)
      })
      return await message.sendMessage(msg)
    }
    let gjid = isGroup(user)
    if (!gjid) return await message.sendMessage(Lang.GJID)
    if (user != undefined && !message.reply_message.txt && hours == undefined) {
      let info = await getMute(user)
      let { jid, message: msgs, hour, minute, onoroff } = info
      return await message.sendMessage(
        Lang.SCHEDULE_MSG.format(jid, msgs, hour, minute, onoroff)
      )
    } else if (
      user != undefined &&
      hours != undefined &&
      (hours == "on" || hours == "off")
    ) {
      let info = await getMute(user)
      if (info == false) return await message.sendMessage(Lang.NOT_FOUND)
      let { jid, message: msgs, hour, minute, onoroff } = info
      await setMute(user, msgs, hour, minute, hours == "on" ? true : false)
      return await message.sendMessage(
        Lang.SCHEDULE_MSG.format(jid, msgs, hour, minute, onoroff) +
          "*Restart bot*"
      )
    } else if (!user || !hours || !minute) {
      if (!message.reply_message || !message.reply_message.txt)
        return await message.sendMessage(Lang.NEED_REPLY)
      return await message.sendMessage(Lang.SYNTAX)
    } else {
      await setMute(user, msg, hours, minute, true)
      return await message.sendMessage(Lang.MUTE.format(user, hours, minute))
    }
  }
)

Asena.addCommand(
  {
    pattern: "autoumute ?(.*)",
    fromMe: true,
    desc: Lang.AUTOUMUTE_DESC,
  },
  async (message, match) => {
    let participants = await message.groupMetadata(message.jid)
    let im = await checkImAdmin(participants, message.client.user.jid)
    if (!im) return await message.sendMessage(Lang1.IM_NOT_ADMIN)
    if (match == "" && !message.reply_message) {
      return await message.sendMessage(Lang.UNMUTE_NEED_REPLY)
    }
    let msg = message.reply_message.text || "false"
    let [user, hours, minute] = match.split(" ")
    if (user == "list") {
      let all = await getEachUnmute()
      if (!all) return await message.sendMessage(Lang.NO_SCHEDULE)
      let msg = ""
      all.forEach((jids) => {
        let { jid, message, hour, minute, onoroff } = jids
        msg += Lang.SCHEDULE_MSG.format(jid, message, hour, minute, onoroff)
      })
      return await message.sendMessage(msg)
    }
    let gjid = isGroup(user)
    if (!gjid) return await message.sendMessage(Lang.GJID)
    if (user != undefined && !message.reply_message.txt && hours == undefined) {
      let info = await getUnmute(user)
      let { jid, message: msgs, hour, minute, onoroff } = info
      return await message.sendMessage(
        Lang.SCHEDULE_MSG.format(jid, msgs, hour, minute, onoroff)
      )
    } else if (
      user != undefined &&
      hours != undefined &&
      (hours == "on" || hours == "off")
    ) {
      let info = await getUnmute(user)
      if (info == false) return await message.sendMessage(Lang.NOT_FOUND)
      let { jid, message: msgs, hour, minute, onoroff } = info
      await setUnmute(user, msgs, hour, minute, hours == "on" ? true : false)
      return await message.sendMessage(
        Lang.SCHEDULE_MSG.format(jid, msgs, hour, minute, onoroff) +
          `\n\n*Restart bot*`
      )
    } else if (!user || !hours || !minute) {
      if (!message.reply_message || !message.reply_message.txt)
        return await message.sendMessage(Lang.NEED_REPLY)
      return await message.sendMessage(Lang.SYNTAX)
    } else {
      await setUnmute(user, msg, hours, minute, true)
      return await message.sendMessage(Lang.UNMUTE.format(user, hours, minute))
    }
  }
)

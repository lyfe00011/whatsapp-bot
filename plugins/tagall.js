/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const Language = require("../language")
const { participateInVote, parseVote } = require("../Utilis/vote")
const { forwardOrBroadCast } = require("../Utilis/groupmute")
const {
  addSpace,
  getAllMessageCount,
  utt,
  checkImAdmin,
  arrRm,
} = require("../Utilis/Misc")
const { getName } = require("../Utilis/download")
const Lang = Language.getString("tagall")
const s = "```"
// const config = require('../config');
Asena.addCommand(
  {
    pattern: "tag ?(.*)",
    fromMe: true,
    onlyGroup: true,
    desc: Lang.TAGALL_DESC,
  },
  async (message, match) => {
    let participants = await message.groupMetadata(message.jid)
    let mentionedJid = participants.map((user) => user.jid)
    if (match == "all") {
      let mesaj = ""
      mentionedJid.forEach(
        (e, i) =>
          (mesaj += `${i + 1}${addSpace(i + 1, participants.length)} @${
            e.split("@")[0]
          }\n`)
      )
      return await message.sendMessage(s + mesaj + s, {
        contextInfo: { mentionedJid },
      })
    } else if (match == "admin" || match == "admins") {
      let mesaj = ""
      let mentionedJid = participants
        .filter((user) => user.isAdmin == true)
        .map((user) => user.jid)
      mentionedJid.forEach((e) => (mesaj += `@${e.split("@")[0]}\n`))
      return await message.sendMessage(mesaj, {
        contextInfo: { mentionedJid },
      })
    } else if (match == "notadmin" || match == "not admins") {
      let mesaj = ""
      let mentionedJid = participants
        .filter((user) => user.isAdmin != true)
        .map((user) => user.jid)
      mentionedJid.forEach((e) => (mesaj += `@${e.split("@")[0]}\n`))
      return await message.sendMessage(mesaj, {
        contextInfo: { mentionedJid },
      })
    }
    if (!message.reply_message)
      return await message.sendMessage("*Reply to a message*")
    forwardOrBroadCast(message.jid, message, { contextInfo: { mentionedJid } })
  }
)

Asena.addCommand(
  {
    pattern: "msgs ?(.*)",
    fromMe: true,
    desc: "Shows all members Msg count",
    onlyGroup: true,
  },
  async (message, match) => {
    const users = await getAllMessageCount(
      message.jid,
      message.mention[0] || message.reply_message.jid
    )
    if (!users) return await message.sendMessage("*No data found!*")
    let msg = ""
    for (const user in users) {
      const { total, type, time } = users[user]
      let types = ""
      for (const item in type) {
        types += `${item}${addSpace(item, "msgscount")} : ${type[item]}\n`
      }
      msg += `Number    : ${user.split("@")[0]}\nName      : ${getName(
        user,
        message.client
      )}\nTotal Msg : ${total}\n${types.trim()}\nLastMsg   : ${utt(time)}\n\n`
    }
    await message.sendMessage("```" + msg.trim() + "```")
  }
)

Asena.addCommand(
  {
    pattern: "inactive ?(.*)",
    fromMe: true,
    desc: "Kick or Show inactive members",
    onlyGroup: true,
  },
  async (message, match) => {
    const participants = await message.groupMetadata(message.jid)
    const im = await checkImAdmin(participants, message.client.user.jid)
    if (!im) return await message.sendMessage("*I'am not admin.*")
    const [dayOrTotal, c, kick] = match.split(" ") || []
    if (
      !dayOrTotal ||
      !c ||
      (dayOrTotal != "day" && dayOrTotal != "total") ||
      isNaN(c) ||
      (kick && kick != "kick")
    )
      return await message.sendMessage(
        "*Example :*\n*.inactive day 10 //show those not message for last 10 days.*\n\n*.inactive total 100 // show those have total msg count less than 100.*\n\n*.inactive total 100 kick //to kick inactive ones*"
      )
    let msg =
      dayOrTotal == "day"
        ? `Not msg for last ${c} day(s).\n\n`
        : `Msg count less than ${c}\n\n`
    let Z = participants.map(({ jid }) => jid)
    const inactive = []
    const today = new Date().getTime()
    const users = await getAllMessageCount(message.jid)
    for (const user in users) {
      Z = arrRm(Z, user)
      const { time, total } = users[user]
      if (dayOrTotal == "day") {
        const diffDay = (today - time) / (1000 * 60 * 60 * 24)
        if (diffDay > c) {
          inactive.push(user)
          msg += `@${user.split("@")[0]} last msg ${Math.floor(
            diffDay
          )} day ago\n`
        }
      } else if (dayOrTotal == "total") {
        if (total < c) {
          inactive.push(user)
          msg += `@${user.split("@")[0]} : ${total} msgs\n`
        }
      }
    }
    const jids = [...inactive, ...Z]
    if (kick) {
      await message.sendMessage(`_Removing ${jids.length} inactive members..._`)
      await new Promise((r) => setTimeout(r, 10 * 1000))
      for (const jid of jids) {
        await new Promise((r) => setTimeout(r, 1000))
        await message.groupRemove(message.jid, jid)
      }
    } else
      return await message.sendMessage(
        "```" +
          `${msg.trim()}${
            Z.length < 1
              ? ""
              : `\n\nwith 0 messages : ${Z.length}\n` +
                Z.map((jid) => `@${jid.split("@")[0]}`)
                  .join("\n")
                  .trim()
          }` +
          "```",
        { contextInfo: { mentionedJid: jids } }
      )
  }
)

Asena.addCommand(
  { pattern: "vote ?(.*)", fromMe: true, desc: Lang.VOTE_DESC },
  async (message, match) => {
    const { msg, options, type } = await parseVote(message, match)
    return await message.sendMessage(msg, options, type)
  }
)

Asena.addCommand({ on: "vote", fromMe: false }, async (message, match) => {
  const msg = await participateInVote(message)
  if (msg) return await message.sendMessage(msg, { quoted: message.data })
})

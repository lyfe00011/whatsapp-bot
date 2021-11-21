/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const Language = require("../language")
const Lang = Language.getString("web")
const QRReader = require("qrcode-reader")
const jimp = require("jimp")
// const config = require('../config');
const {
  setSchedule,
  getSchedule,
  getEachSchedule,
} = require("../Utilis/schedule")

Asena.addCommand(
  { pattern: "ping", fromMe: true, desc: Lang.PING_DESC },
  async (message, match) => {
    let start = new Date().getTime()
    await message.reply("```Ping!```")
    let end = new Date().getTime()
    return await message.sendMessage(
      "*Pong!*\n ```" + (end - start) + "``` *ms*"
    )
  }
)

Asena.addCommand(
  { pattern: "qr", fromMe: true, desc: "Read Qr.", owner: false },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage("*Reply to a qr image.*")

    let location = await message.reply_message.downloadMediaMessage()
    let img = await jimp.read(location)
    let qr = new QRReader()
    qr.callback = async (err, value) => {
      if (err) return await message.sendMessage(err, { quoted: message.data })
      return await message.sendMessage(value.result, { quoted: message.data })
    }
    qr.decode(img.bitmap)
  }
)

Asena.addCommand(
  {
    pattern: "schedule ?(.*)",
    fromMe: true,
    desc: "Shedule Message.",
    owner: false,
  },
  async (message, match) => {
    if (!message.reply_message && match == "")
      return await message.sendMessage(`
Reply to message
Example:
jid year dayOfWeek month date  hour minute

  jid: 919876543210@s.whatsapp.net
  year: *
  dayofweek: *
  month: 1
  date: 1
  hour: 0
  minute: 0

919876543210@s.whatsapp.net * * 1 1 0 0
This is a example to schedule a new year wish

  jid: 919876543210@s.whatsapp.net
  year: *
  dayofweek: *
  month: *
  date: *
  hour: 7
  minute: 0

919876543210@s.whatsapp.net * * * * 7 0
This is a good morning wish example

  jid: 919876543210@s.whatsapp.net
  year: *
  dayofweek: *
  month: *
  date: *
  hour: 23
  minute: 30

  919876543210@s.whatsapp.net * * * * 23 30
  Good Night Example

  jid: 919876543210@s.whatsapp.net
  year: *
  dayofweek: *
  month: 6
  date: 20
  hour: 0
  minute: 0
  
919876543210@s.whatsapp.net * * 6 20 0 0
Specific day example

Month 1-12
Date 1-31
Hour 0-23
Minute 0-59
DayOfWeek 0-6 (0 is Sunday, for multiple 0,1,2...,6)

To get Shedule
.shedule 89237489-46723@g.us

To on/off
.shedule 89237489-46723@g.us on
.shedule 89237489-46723@g.us off

To get all Shedules

.shedule list
`)
    let msg = message.reply_message.text
    let [jid, year, dayofweek, month, date, hour, minute] = match.split(" ")
    if (jid == "list") {
      let all = await getEachSchedule()
      if (!all) return await message.sendMessage("*No shedule to Display*")
      let msg = ""
      all.forEach((jids) => {
        let {
          jid,
          message,
          year,
          month,
          date,
          hour,
          minute,
          dayofweek,
          onoroff,
        } = jids
        msg += `Jid       : ${jid}\nMessage   : ${message}\nYear      : ${year}\nMonth     : ${month}
Hour      : ${hour}\nMinute    : ${minute}\nDate      : ${date}\nDayOfWeek : ${dayofweek}\nEnabled   : ${onoroff}\n\n`
      })
      return await message.sendMessage("```" + msg + "```")
    }
    if (jid != undefined && !message.reply_message.txt && year == undefined) {
      let info = await getSchedule(jid)
      if (info == false) return await message.sendMessage("*Not Found*")
      let {
        jid: user,
        message: msgs,
        year,
        month,
        date,
        hour,
        minute,
        dayofweek,
        onoroff,
      } = info
      return await message.sendMessage(`
Jid: ${user}
Message: ${msgs}
Year: ${year}
Month: ${month}
Date: ${date}
Hour: ${hour}
Minute: ${minute}
DayOfWeek: ${dayofweek}
Enabled: ${onoroff}`)
    } else if (
      jid != undefined &&
      year != undefined &&
      (year == "on" || year == "off")
    ) {
      let info = await getSchedule(jid)
      if (info == false) return await message.sendMessage("*Not Found*")
      let {
        jid: user,
        message: msgs,
        year: yr,
        month,
        date,
        hour,
        minute,
        dayofweek,
      } = info
      await setSchedule(
        user,
        msgs,
        yr,
        dayofweek,
        month,
        date,
        hour,
        minute,
        year == "on" ? true : false
      )
      return await message.sendMessage(`Jid: ${user}
Message: ${msgs}
Year: ${yr}
Month: ${month}
Date: ${date}
Hour: ${hour}
Minute: ${minute}
dayofweek: ${dayofweek}
Enabled: ${year}\n\n*Restart bot*`)
    } else if (
      !jid ||
      msg == "" ||
      !year ||
      !dayofweek ||
      !month ||
      !date ||
      !hour ||
      !minute
    ) {
      return await message.sendMessage("*Syntax Error!*")
    } else {
      await setSchedule(
        jid,
        msg,
        year,
        dayofweek,
        month,
        date,
        hour,
        minute,
        true
      )
      await message.sendMessage(`Sheduled ${msg} for ${jid}\n\n*Restart bot*`)
    }
  }
)

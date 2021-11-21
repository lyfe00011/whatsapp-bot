/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const FilterDb = require("./sql/filters")
// const config = require('../config');
const Language = require("../language")
const { prepareFilter } = require("../Utilis/greetings")
const Lang = Language.getString("filters")
let fm = true
Asena.addCommand(
  { pattern: "filter ?(.*)", fromMe: fm, desc: Lang.FILTER_DESC },
  async (message, match) => {
    match = message.message.match(/[\'\"](.*?)[\'\"]/gms)
    if (match === null) {
      filtreler = await FilterDb.getFilter(message.jid)
      if (filtreler === false) {
        await message.sendMessage(Lang.NO_FILTER)
      } else {
        var mesaj = Lang.FILTERS + "\n"
        filtreler.map(
          (filter) => (mesaj += "```=> " + filter.dataValues.pattern + "```\n")
        )
        await message.sendMessage(mesaj)
      }
    } else {
      if (match.length < 2) {
        return await message.sendMessage(
          Lang.NEED_REPLY + " ```.filter 'sa' 'as'"
        )
      }
      await FilterDb.setFilter(
        message.jid,
        match[0].replace(/['"]+/g, ""),
        match[1].replace(/['"]+/g, ""),
        match[0][0] === "'" ? true : false
      )
      await message.sendMessage(
        Lang.FILTERED.format(match[0].replace(/['"]+/g, ""))
      )
    }
  }
)

Asena.addCommand(
  { pattern: "stop ?(.*)", fromMe: fm, desc: Lang.STOP_DESC },
  async (message, match) => {
    match = message.message.match(/[\'\"](.*?)[\'\"]/gms)
    if (match === null) {
      return await message.sendMessage(
        Lang.NEED_REPLY + "\n*Example:* ```.stop 'hello'```"
      )
    }

    del = await FilterDb.deleteFilter(
      message.jid,
      match[0].replace(/['"]+/g, "")
    )

    if (!del) {
      await message.sendMessage(Lang.ALREADY_NO_FILTER)
    } else {
      await message.sendMessage(Lang.DELETED)
    }
  }
)

Asena.addCommand({ on: "text", fromMe: false }, async (message, match) => {
  let filtreler = await FilterDb.getFilter(message.jid)
  if (!filtreler) return
  filtreler.map(async (filter) => {
    pattern = new RegExp(
      filter.dataValues.regex
        ? filter.dataValues.pattern
        : "\\b(" + filter.dataValues.pattern + ")\\b",
      "gm"
    )
    if (pattern.test(message.message)) {
      let { msg, MessageType } = await prepareFilter(filter.dataValues.text)
      await message.sendMessage(
        msg,
        {
          quoted: message.data,
        },
        MessageType
      )
    }
  })
})

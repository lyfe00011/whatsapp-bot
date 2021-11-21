/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
Thanks to github/@justinthoms for base and helps.
*/

const Asena = require("../Utilis/events")
const Config = require("../config")
const tesseract = require("node-tesseract-ocr")
const langs = require("langs")
const Language = require("../language")
const Lang = Language.getString("ocr")
// let fm = Config.PRIVATE == true ? true : false;
Asena.addCommand(
  { pattern: "txt ?(.*)", fromMe: true, desc: Lang.OCR_DESC, usage: "txt en" },
  async (message, match) => {
    if (message.reply_message === false || !message.reply_message.image)
      return await message.sendMessage(Lang.NEED_REPLY)
    await message.reply(Lang.DOWNLOADING)
    var location = await message.reply_message.downloadAndSaveMediaMessage(
      "yxy"
    )
    var dil
    if (match !== "") {
      dil = langs.where("1", match)
    } else {
      dil = langs.where("1", Config.LANG.toLowerCase())
    }
    try {
      var result = await tesseract.recognize(location, {
        lang: dil[2],
      })
    } catch (e) {
      return await message.reply(Lang.ERROR.format(e))
    }
    if (result === " " || result.length == 1) {
      return await message.reply(Lang.ERROR.format(" Empty text"))
    }

    return await message.reply(Lang.RESULT.format(dil[2], result))
  }
)

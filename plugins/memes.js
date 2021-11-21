/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
Coded by @KursadHD
*/

const Asena = require("../Utilis/events")
const { MessageType, Mimetype } = require("@adiwajshing/baileys")
const fs = require("fs")
const Language = require("../language")
const { memeMaker } = require("../Utilis/meme")
const Lang = Language.getString("memes")

Asena.addCommand(
  {
    pattern: "meme ?(.*)",
    fromMe: true,
    desc: Lang.MEMES_DESC,
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.NEED_REPLY)
    if (match === "") return await message.sendMessage("*Syntax Error!*")
    let [topText, bottomText, fontFill, fontSize] = match.split(";")
    let location = await message.reply_message.downloadAndSaveMediaMessage(
      "mem"
    )
    memeMaker({
      image: location,
      outfile: "meme.png",
      topText: topText,
      bottomText: bottomText,
      fontFill: fontFill,
      fontSize: fontSize,
    }).then(async () => {
      await message.sendMessage(
        fs.readFileSync("meme.png"),
        { filename: "meme.png", mimetype: Mimetype.png },
        MessageType.image
      )
    })
  }
)

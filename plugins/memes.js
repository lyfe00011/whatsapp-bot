/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
Coded by @KursadHD
*/

const Asena = require("../Utilis/events");
const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const memeMaker = require("meme-maker");
const fs = require("fs");
const Language = require("../language");
const Lang = Language.getString("memes");

Asena.addCommand(
  {
    pattern: "meme ?(.*)",
    fromMe: true,
    desc: Lang.MEMES_DESC
  },
  async (message, match) => {
    if (message.reply_message === false)
      return await message.sendMessage(Lang.NEED_REPLY);
    var topText, bottomText;
    if (match === "") return await message.sendMessage("*Syntax Error!*");
    if (match.includes(";")) {
      var split = match.split(";");
      topText = split[1];
      bottomText = split[0];
    } else {
      topText = match;
      bottomText = "";
    }
    var location = await message.reply_message.downloadAndSaveMediaMessage(
      "mem"
    );
    memeMaker(
      {
        image: location,
        outfile: "meme.png",
        topText: topText,
        bottomText: bottomText,
      },
      async function (err) {
        if (err) return await message.sendMessage(err.message);
        await message.sendMessage(
          fs.readFileSync("meme.png"),
          { filename: "meme.png", mimetype: Mimetype.png },
          MessageType.image
        );
      }
    );
  }
);

/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const { MessageType, Mimetype } = require("@adiwajshing/baileys")
const Language = require("../language")
const config = require("../config")
const { removeBg } = require("../Utilis/download")
const Lang = Language.getString("removebg")
let fm = true

Asena.addCommand(
  { pattern: "removebg", fromMe: fm, desc: Lang.REMOVEBG_DESC },
  async (message, match) => {
    if (config.REMOVEBG == "null" || config.REMOVEBG == "false")
      return await message.sendMessage('```' +
      `1. Create a account in remove.bg
2. Verify your account.
3. Copy your Key.
4. .setvar REMOVEBG_KEY:copied_key
.......................

Example => .setvar REMOVEBG_KEY:GWQ6jVy9MBpfYF9SnyG8jz8P
      
For making this steps easy 
Click SIGNUP LINK and Choose Google a/c
after completing signup
Click KEY LINK and copy your KEY.(Press show BUTTON)

SIGNUP LINK : https://accounts.kaleido.ai/users/sign_up 

KEY LINK : https://www.remove.bg/dashboard#api-key` + '```')
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.NEED_PHOTO)
    let location = await message.reply_message.downloadMediaMessage()
    let buffer = await removeBg(location, config.REMOVEBG)
    if (typeof buffer == "string") {
      if (buffer.includes("403")) return await message.sendMessage(Lang.RBGING)
      else if (buffer.includes("402"))
        return await message.sendMessage(Lang.LIMIT)
      else return await message.sendMessage(buffer)
    }
    return await message.sendMessage(
      buffer,
      { quoted: message.quoted, mimetype: Mimetype.png },
      MessageType.image
    )
  }
)

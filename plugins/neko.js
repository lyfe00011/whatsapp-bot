/*
Nekobin for WhatsAsena - W4RR10R

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const { MessageType } = require("@adiwajshing/baileys")
const got = require("got")

const Language = require("../language")
const Lang = Language.getString("nekobin")

Asena.addCommand(
  { pattern: "neko", fromMe: true, desc: Lang.NEKO_DESC },
  async (message, match) => {
    if (!message.reply_message)
      return await message.sendMessage(Lang.NEED_REPLY)
    if (!message.reply_message.text)
      return await message.sendMessage(Lang.MUST_TEXT)
    let base_URI = "https://nekobin.com/api/documents"
    try {
      const response = await got.post(base_URI, {
        json: { content: message.reply_message.text },
      })
      json = JSON.parse(response.body)
      neko_url = "https://nekobin.com/" + json.result.key
      await message.reply(neko_url)
    } catch (err) {
      await message.reply(err.message, MessageType.text)
      console.log(err.message)
    }
  }
)

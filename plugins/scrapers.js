/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const { MessageType, Mimetype } = require("@adiwajshing/baileys")
const translatte = require("translatte")
const config = require("../config")
//============================== TTS ==================================================
const fs = require("fs")
const { getBuffer } = require("../Utilis/download")
const { SpeachToText, generateListMessage } = require("../Utilis/Misc")
//=====================================================================================
//============================== YOUTUBE ==============================================
const ytdl = require("ytdl-core")
const yts = require("yt-search")
const ytid =
  /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
//=====================================================================================
const Language = require("../language")
const Lang = Language.getString("scrapers")
const wiki = require("wikijs").default
const gis = require("g-i-s")
const { song } = require("../Utilis/fFmpeg")
let fm = true

Asena.addCommand(
  {
    pattern: "trt ?(.*)",
    desc: Lang.TRANSLATE_DESC,
    usage: Lang.TRANSLATE_USAGE,
    fromMe: true,
  },
  async (message, match) => {
    if (!message.reply_message.txt)
      return await message.sendMessage(Lang.NEED_REPLY, {
        quoted: message.data,
      })
    let match2 = match.split(" ")[0]
    let match1 = match.split(" ")[1]
    match1 = match1 === "" || match1 === undefined ? "auto" : match1
    match2 = match2 === "" || match2 === undefined ? config.LANG : match2
    ceviri = await translatte(message.reply_message.text, {
      from: match1,
      to: match2,
    })
    if ("text" in ceviri) {
      return await message.sendMessage(
        Lang.TRT.format(match1, match2, ceviri.text),
        { quoted: message.quoted }
      )
    } else {
      return await message.sendMessage(Lang.TRANSLATE_ERROR, {
        quoted: message.data,
      })
    }
  }
)

Asena.addCommand(
  { pattern: "tts ?(.*)", fromMe: fm, desc: Lang.TTS_DESC },
  async (message, match) => {
    if (match == "") return
    let LANG = config.LANG.toLowerCase(),
      ttsMessage = match
    if ((langMatch = match.match("\\{([a-z]{2})\\}"))) {
      LANG = langMatch[1]
      ttsMessage = ttsMessage.replace(langMatch[0], "")
    }
    let buffer = await SpeachToText(LANG, ttsMessage)
    return await message.sendMessage(buffer, { ptt: true }, MessageType.audio)
  }
)

Asena.addCommand(
  { pattern: "song ?(.*)", fromMe: true, desc: Lang.SONG_DESC },
  async (message, match) => {
    match = !message.reply_message ? match : message.reply_message.text
    if (match === "")
      return await message.sendMessage(Lang.NEED_TEXT_SONG, {
        quoted: message.data,
      })
    if (!ytid.test(match)) {
      let arama = await yts(match)
      arama = arama.all
      if (arama.length < 1)
        return await message.sendMessage(
          "```" + `${match} not found.` + "```",
          { quoted: message.data }
        )
      let msg = await generateListMessage(arama)
      return await message.sendMessage(msg, {}, MessageType.listMessage)
    }
    let bit = 192
    if (
      (matched = match.match(
        "\\{((320)|(3[0-1][0-9]{1})|([1-2][0-9]{2})|([4-9][0-9]{1})|(3[2-9]))\\}"
      ))
    ) {
      bit = parseInt(matched[1])
      match = match.replace(matched[0], "").trim()
    }
    try {
      let vid = ytid.exec(match)[1]
      await message.sendMessage(Lang.DOWNLOADING_SONG)
      let stream = ytdl(vid, {
        quality: "highestaudio",
      })
      let songname = new Date().getTime() + ".mp3"
      let buffer = await song(songname, stream, bit)
      if (!buffer)
        return await message.sendMessage(
          "*Downloading failed*\n```Restart BOT```"
        )
      return await message.sendMessage(
        buffer,
        {
          mimetype: Mimetype.mp4Audio,
          quoted: message.data,
          ptt: false,
        },
        MessageType.audio
      )
    } catch (error) {
      return await message.sendMessage("```" + `Downloading failed.` + "```", {
        quoted: message.data,
      })
    }
  }
)

Asena.addCommand(
  { pattern: "video ?(.*)", fromMe: fm, desc: Lang.VIDEO_DESC },
  async (message, match) => {
    match = !message.reply_message ? match : message.reply_message.text
    let vid = ytid.exec(match)
    if (match === "" || !vid) return await message.sendMessage(Lang.NEED_VIDEO)
    try {
      let arama = await yts({ videoId: vid[1] })
      if (arama.seconds === 0)
        return await message.sendMessage(Lang.NO_SONG, {
          quoted: message.data,
        })
      await message.sendMessage(Lang.DOWNLOADING_VIDEO)
      let yt = ytdl(arama.videoId, {
        filter: (format) =>
          format.container === "mp4" &&
          ["720p", "480p", "360p", "240p", "144p"].map(() => true),
      })
      yt.pipe(fs.createWriteStream("./" + arama.videoId + ".mp4"))
      yt.on("end", async () => {
        return await message.sendMessage(
          fs.readFileSync("./" + arama.videoId + ".mp4"),
          { mimetype: Mimetype.mp4, quoted: message.quoted },
          MessageType.video
        )
      })
    } catch {
      return await message.sendMessage(Lang.NO_RESULT)
    }
  }
)

Asena.addCommand(
  { pattern: "yts ?(.*)", fromMe: true, desc: Lang.YT_DESC },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_WORDS)
    try {
      var arama = await yts(match)
    } catch {
      return await message.sendMessage(Lang.NOT_FOUND)
    }
    let mesaj = ""
    arama.all.map((video) => {
      mesaj += "*" + video.title + "* - " + video.url + "\n"
    })
    return await message.sendMessage(mesaj)
  }
)

Asena.addCommand(
  { pattern: "wiki ?(.*)", fromMe: true, desc: Lang.WIKI_DESC },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_WORDS)
    await message.sendMessage(Lang.SEARCHING)
    try {
      let arama = await wiki({
        apiUrl: "https://" + config.LANG + ".wikipedia.org/w/api.php",
      }).page(match)
      let info = await arama.rawContent()
      return await message.sendMessage(info)
    } catch (error) {
      return await message.sendMessage(`*${error.message}*`)
    }
  }
)

Asena.addCommand(
  { pattern: "img ?(.*)", fromMe: true, desc: Lang.IMG_DESC },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_WORDS)
    gis(match, async (error, result) => {
      for (let i = 0; i < (result.length < 10 ? result.length : 10); i++) {
        let { buffer } = await getBuffer(result[i].url)
        if (buffer != false)
          await message
            .sendMessage(buffer, { quoted: message.data }, MessageType.image)
            .catch((e) => console.log(e.message))
      }
    })
  }
)

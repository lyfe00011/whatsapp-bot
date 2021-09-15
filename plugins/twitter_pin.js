// const config = require('../config');
let fm = true;
const Asena = require("../Utilis/events");
const { MessageType } = require("@adiwajshing/baileys");
const { getBuffer, mediaFire } = require("../Utilis/download");
const { pinterest, twitter } = require("../Utilis/Misc");
const Language = require("../language");
const Lang = Language.getString("twitter");
Asena.addCommand(
  {
    pattern: "twitter ?(.*)",
    fromMe: fm,
    desc: Lang.TWITTER_DESC
  },
  async (message, match) => {
    match = !message.reply_message ? match : message.reply_message.text;
    if (match === "") return await message.sendMessage(Lang.NEED_REPLY);
    let urls = await twitter(match);
    if (!urls) return await message.sendMessage(Lang.NOT_FOUND);
    let { buffer } = await getBuffer(urls[0]);
    if (buffer !== false)
      await message.sendMessage(buffer, {}, MessageType.video);
  }
);

Asena.addCommand(
  {
    pattern: "pinterest ?(.*)",
    fromMe: fm,
    desc: Lang.PINTEREST_DESC
  },
  async (message, match) => {
    match = !message.reply_message ? match : message.reply_message.text;
    if (match === "") return await message.sendMessage(LanG.NEED_REPLY);
    let urls = await pinterest(match);
    urls.forEach(async (url) => {
      if (url != undefined) {
        let { buffer, type } = await getBuffer(url);
        if (type == "video")
          await message.sendMessage(buffer, {}, MessageType.video);
        else if (type == "image")
          await message.sendMessage(buffer, {}, MessageType.image);
      }
    });
  }
);

Asena.addCommand(
  {
    pattern: "mediafire ?(.*)",
    fromMe: fm,
    desc: Lang.MEDIAFIRE_DESC
  },
  async (message, match) => {
    match = !message.reply_message ? match : message.reply_message.text;
    if (match === "") return await message.sendMessage("*Give me a link.*");
    const { link, title } = await mediaFire(match);
    let { buffer, type, size, mime } = await getBuffer(link);
    if (size > 100)
      return await message.sendMessage(Lang.SIZE.format(size));
    if (type == "video")
      return await message.sendMessage(
        buffer,
        { filename: title, mimetype: mime },
        MessageType.video
      );
    else if (type == "image")
      return await message.sendMessage(
        buffer,
        { filename: title, mimetype: mime },
        MessageType.image
      );
    else if (type == "audio")
      return await message.sendMessage(
        buffer,
        { filename: title, mimetype: mime },
        MessageType.audio
      );
    else
      return await message.sendMessage(
        buffer,
        { filename: title, mimetype: mime },
        MessageType.document
      );
  }
);

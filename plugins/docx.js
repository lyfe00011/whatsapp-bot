const toPDF = require("custom-soffice-to-pdf");
const Asena = require("../Utilis/events");
const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { banner } = require("../Utilis/Misc");
const Language = require("../language");
const Lang = Language.getString("docx");
Asena.addCommand(
  { pattern: "topdf", fromMe: true, desc: Lang.TOPDF_DESC, usage: Lang.TOPDF_USAGE },
  async (message, match) => {
    if (!message.reply_message)
      return await message.sendMessage(Lang.REPLY_MSG);
    if (
      message.reply_message.audio ||
      message.reply_message.video ||
      message.reply_message.sticker ||
      message.reply_message.pdf
    )
      return message.sendMessage(Lang.NOT_SUPPORTED);
    let location = await message.reply_message.downloadMediaMessage();
    toPDF(location).then(
      async (pdfBuffer) => {
        return await message.sendMessage(
          pdfBuffer,
          {
            filename: Math.floor(Math.random() * 999999) + ".pdf",
            mimetype: Mimetype.pdf,
          },
          MessageType.document
        );
      },
      (err) => console.log(`topdf : ${err}`)
    );
  }
);

Asena.addCommand(
  { pattern: "wasted", fromMe: true, desc: Lang.WASTED_DESC, usage: Lang.WASTED_USAGE },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.REPLY);
    let location = await message.reply_message.downloadMediaMessage();
    let buffer = await banner(location, "wasted");
    return await message.sendMessage(buffer, {}, MessageType.image);
  }
);

Asena.addCommand(
  { pattern: "trigged", fromMe: true, desc: Lang.TRIGGERED_DESC, usage: Lang.TRGGERED_USAGE },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.REPLY);
    let location = await message.reply_message.downloadMediaMessage();
    let buffer = await banner(location, "triggered");
    return await message.sendMessage(
      buffer,
      { mimetype: Mimetype.webp },
      MessageType.sticker
    );
  }
);

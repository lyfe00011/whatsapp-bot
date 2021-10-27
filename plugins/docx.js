const toPDF = require("custom-soffice-to-pdf");
const Asena = require("../Utilis/events");
const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { banner, checkBroadCast, stylishTextGen } = require("../Utilis/Misc");
const Language = require("../language");
const { forwardOrBroadCast } = require("../Utilis/groupmute");
const { parseJid } = require("../Utilis/vote");
const { readMore } = require("../Utilis/download");
const Lang = Language.getString("docx");
Asena.addCommand(
  {
    pattern: "topdf",
    fromMe: true,
    desc: Lang.TOPDF_DESC,
    usage: Lang.TOPDF_USAGE,
  },
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
    toPDF(await message.reply_message.downloadMediaMessage()).then(
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
  {
    pattern: "wasted",
    fromMe: true,
    desc: Lang.WASTED_DESC,
    usage: Lang.WASTED_USAGE,
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.REPLY);
    return await message.sendMessage(
      await banner(
        await message.reply_message.downloadMediaMessage(),
        "wasted"
      ),
      {},
      MessageType.image
    );
  }
);

Asena.addCommand(
  {
    pattern: "mission",
    fromMe: true,
    desc: Lang.WASTED_DESC,
    usage: Lang.WASTED_USAGE,
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.REPLY);
    return await message.sendMessage(
      await banner(
        await message.reply_message.downloadMediaMessage(),
        "passed"
      ),
      {},
      MessageType.image
    );
  }
);

Asena.addCommand(
  {
    pattern: "jail",
    fromMe: true,
    desc: Lang.WASTED_DESC,
    usage: Lang.WASTED_USAGE,
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.REPLY);
    return await message.sendMessage(
      await banner(await message.reply_message.downloadMediaMessage(), "jail"),
      {},
      MessageType.image
    );
  }
);

Asena.addCommand(
  {
    pattern: "trigged",
    fromMe: true,
    desc: Lang.TRIGGERED_DESC,
    usage: Lang.TRGGERED_USAGE,
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(Lang.REPLY);
    return await message.sendMessage(
      await banner(
        await message.reply_message.downloadMediaMessage(),
        "triggered"
      ),
      { mimetype: Mimetype.webp },
      MessageType.sticker
    );
  }
);

Asena.addCommand(
  {
    pattern: "readmore ?(.*)",
    fromMe: true,
    desc: Lang.READMORE_DESC,
  },
  async (message, match) => {
    await message.sendMessage(
      readMore(!message.reply_message ? match : message.reply_message.text)
    );
  }
);

Asena.addCommand(
  { pattern: "broadcast ?(.*)", fromMe: true, desc: Lang.BROADCAST_DESC },
  async (message, match) => {
    let { msg, result, broadcast, status } = await checkBroadCast(match);
    if (status == false)
      return await message.sendMessage(Lang.BROADCAST_EXAMPLE);
    if (msg) return await message.sendMessage(msg);
    if (result)
      return await message.sendMessage(
        Lang.BROADCAST_SET.format(result, result)
      );
    if (!message.reply_message)
      return await message.sendMessage(Lang.REPLY_MSG);
    await message.client.sendMessage(
      message.client.user.jid,
      Lang.BROADCASTING.format(broadcast),
      MessageType.text
    );
    broadcast.match(parseJid).map((jid) => {
      forwardOrBroadCast(jid, message);
    });
  }
);

Asena.addCommand(
  {
    pattern: "fancy ?(.*)",
    fromMe: true,
    desc: "Creates fancy text from given text",
  },
  async (message, match) => {
    return await message.sendMessage("```" + stylishTextGen(match, 2) + "```");
  }
);
/*
bold
italic
bold-italic
sans
sans-bold
sans-italic
sans-bold-italic
script
script-bold
fraktur
fraktur-bold
double
mono
round
round-b
square
square-b
wide
super
sub
small-caps
coptic
wavy
flag
hand
china
cyrilic-to-latin
upside-down
futureAlien
squiggle6
squiggle5
asianStyle2
asianStyle
squares
squiggle4
neon
squiggle3
monospace
squiggle2
currency
symbols
greek
bentText
upperAngles
subscript
superscript
squiggle
doubleStruck
medieval
cursive
oldEnglish
wideText
*/

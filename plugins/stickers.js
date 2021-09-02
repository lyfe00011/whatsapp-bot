/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/
const Asena = require('../Utilis/events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const Language = require('../language');
const { webpToMp4 } = require('../Utilis/download');
const { sticker } = require('../Utilis/fFmpeg');
const Lang = Language.getString('sticker');

Asena.addCommand({ pattern: 'sticker', fromMe: true, desc: Lang.STICKER_DESC }, (async (message, match) => {
    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.image)) return await message.sendMessage(Lang.NEED_REPLY);
    let location = await message.reply_message.downloadAndSaveMediaMessage('sticker');
    if (message.reply_message.image == true) {
        let buffer = await sticker('imagesticker', location);
        return await message.sendMessage(buffer, { mimetype: Mimetype.webp, quoted: message.quoted }, MessageType.sticker);
    } else if (message.reply_message.video == true) {
        let buffer = await sticker('animatedsticker', location, 2);
        return await message.sendMessage(buffer, { mimetype: Mimetype.webp, quoted: message.quoted }, MessageType.sticker);
    }
}));

Asena.addCommand({ pattern: 'mp4', fromMe: true, desc: "Convert animated sticker." }, (async (message, match) => {
    if (!message.reply_message.sticker || !message.reply_message) return await message.sendMessage('*Reply to a animated sticker.*', { quoted: message.data });
    if (message.reply_message.sticker && !message.reply_message.animated) return await message.sendMessage('*Reply to a animated sticker.*', { quoted: message.data });
    let location = await message.reply_message.downloadAndSaveMediaMessage('mp4');
    let buffer = await webpToMp4(location)
    return await message.sendMessage(buffer, { quoted: message.quoted }, MessageType.video);
}));
/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../Utilis/events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const Language = require('../language');
const { getFfmpegBuffer } = require('../Utilis/fFmpeg');
const Lang = Language.getString('tagall');
// const config = require('../config');
Asena.addCommand({ pattern: 'tag ?(.*)', fromMe: true, onlyGroup: true, desc: Lang.TAGALL_DESC }, (async (message, match) => {
    let participants = await message.groupMetadata(message.jid);
    let jids = participants.map(user => user.jid);
    if (match == 'all') {
        let mesaj = '';
        jids.forEach(e => mesaj += `@${e.split('@')[0]}\n`);
        return await message.sendMessage(mesaj, { contextInfo: { mentionedJid: jids } });
    }
    if (message.reply_message.txt) {
        return await message.sendMessage(message.reply_message.text, { contextInfo: { mentionedJid: jids } }, MessageType.extendedText);
    } else if (message.reply_message.image) {
        let location = await message.reply_message.downloadMediaMessage();
        return await message.sendMessage(location, { contextInfo: { mentionedJid: jids } }, MessageType.image);
    } else if (message.reply_message.sticker) {
        let location = await message.reply_message.downloadMediaMessage();
        return await message.sendMessage(location, { contextInfo: { mentionedJid: jids } }, MessageType.sticker);
    } else if (message.reply_message.video) {
        let location = await message.reply_message.downloadMediaMessage();
        return await message.sendMessage(location, { contextInfo: { mentionedJid: jids } }, MessageType.video);
    } else if (message.reply_message.audio) {
        let location = await message.reply_message.downloadAndSaveMediaMessage('tag');
        let buffer = await getFfmpegBuffer(location, 'tag.mp3', 'mp3');
        return await message.sendMessage(buffer, { mimetype: Mimetype.mp4Audio, ptt: true, contextInfo: { mentionedJid: jids } }, MessageType.audio);
    } else {
        return await message.sendMessage(match == '' ? 'Hi' : match, { contextInfo: { mentionedJid: jids } }, MessageType.extendedText);
    }
}));

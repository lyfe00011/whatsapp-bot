const Asena = require('../Utilis/events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const fs = require('fs');
const Language = require('../language');
const Lang = Language.getString('media');
const fsExtra = require('fs-extra');
// const config = require('../config');
const { pdf } = require('../Utilis/download');
const { audioCut, videoTrim, mergeVideo, getFfmpegBuffer } = require('../Utilis/fFmpeg');
let fm = true

Asena.addCommand({ pattern: 'rotate ?(.*)', fromMe: true, desc: Lang.ROTATE }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.video) return await message.sendMessage(Lang.NEED_REPLY);
    if (match === '') return await message.sendMessage('*Choose an option from right , left or flip.*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('rotate');
    if ((/right/).test(match)) {
        await message.sendMessage(Lang.DOWNLOADING);
        let buffer = await getFfmpegBuffer(location, 'orotate.mp4', 'right');
        return await message.sendMessage(buffer, {}, MessageType.video);
    } else if ((/left/).test(match)) {
        await message.sendMessage(Lang.DOWNLOADING);
        let buffer = await getFfmpegBuffer(location, 'orotate.mp4', 'left');
        return await message.sendMessage(buffer, {}, MessageType.video);
    } else if ((/flip/).test(match)) {
        await message.sendMessage(Lang.DOWNLOADING);
        let buffer = await getFfmpegBuffer(location, 'orotate.mp4', 'flip');
        return await message.sendMessage(buffer, {}, MessageType.video);
    } else await message.sendMessage('*Wrong option*');
}));


Asena.addCommand({ pattern: 'mp3', fromMe: fm, desc: Lang.MP3 }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.video) return await message.sendMessage(Lang.NEED_REPLY);
    let location = await message.reply_message.downloadAndSaveMediaMessage('mp3');
    let buffer = await getFfmpegBuffer(location, 'mp3.mp3', 'mp3');
    return await message.sendMessage(buffer, { filename: 'mp3.mp3', mimetype: Mimetype.mp3, ptt: false }, MessageType.audio);
}));

Asena.addCommand({ pattern: 'photo', fromMe: fm, desc: Lang.PHOTO }, (async (message, match) => {
    if (!message.reply_message.sticker || message.reply_message === false) return await message.sendMessage(Lang.SNEED);
    if (message.reply_message.animated) return await message.sendMessage('*use* _mp4_ *command.*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('photo');
    let buffer = await getFfmpegBuffer(location, 'photo.png', 'photo')
    return await message.sendMessage(buffer, MessageType.image);
}));

Asena.addCommand({ pattern: 'reverse', fromMe: true, desc: 'Reverse audio/video.' }, (async (message, match) => {
    if ((!message.reply_message.audio && !message.reply_message.video) && !message.reply_message) return await message.sendMessage('*Reply to a audio or video!*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('reverse');
    if (message.reply_message.video == true) {
        let buffer = await getFfmpegBuffer(location, 'revered.mp4', 'videor');
        return await message.sendMessage(buffer, { mimetype: Mimetype.mp4, }, MessageType.video);
    } else if (message.reply_message.audio == true) {
        let buffer = await getFfmpegBuffer(location, 'revered.mp3', 'audior');
        return await message.sendMessage(buffer, { filename: 'revered.mp3', mimetype: 'audio/mpeg', ptt: false }, MessageType.audio);
    }
}));

Asena.addCommand({ pattern: 'cut ?(.*)', fromMe: fm, desc: Lang.CUT }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio) return await message.sendMessage(Lang.NEED_CUT_REPLY);
    if (match === '') return await message.sendMessage('```Give start time;Duration.\nExample : .cut 103;30```');
    let start = match.split(';')[0];
    let duration = match.split(';')[1];
    if (start == '' || duration == ''
        || start == undefined || duration == undefined
        || isNaN(start) || isNaN(duration)) return await message.sendMessage('*Syntax Error!*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('cut');
    let buffer = await audioCut(location, start.trim(), duration.trim());
    return await message.sendMessage(buffer, { filename: 'cut.mp3', mimetype: 'audio/mpeg', ptt: false }, MessageType.audio);

}));

Asena.addCommand({ pattern: 'trim ?(.*)', fromMe: fm, desc: Lang.TRIM }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.video) return await message.sendMessage(Lang.NEED_REPLY);
    if (match === '') return await message.sendMessage('```Give start time ; Duration.\nExample : .trim 89;30```');
    let start = match.split(';')[0];
    let duration = match.split(';')[1];
    if (start == '' || duration == '' ||
        start == undefined || duration == undefined
        || isNaN(start) || isNaN(duration)) return await message.sendMessage('*Syntax Error!*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('trim');
    let buffer = await videoTrim(location, start, duration);
    return await message.sendMessage(buffer, { mimetype: Mimetype.mp4, }, MessageType.video);
}));
Asena.addCommand({ pattern: 'page ?(.*)', fromMe: fm, desc: 'To add images.', owner: false }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.image) return await message.sendMessage('*Reply to a image.*');
    if (isNaN(match)) return await message.sendMessage('*Reply with order number*\n*Ex: .page 1*');
    if (!fs.existsSync("./pdf")) {
        fs.mkdirSync('./pdf');
    }
    await message.reply_message.downloadAndSaveMediaMessage(`./pdf/${match}`);
    return await message.sendMessage('```Added page``` ' + match);
}));

Asena.addCommand({ pattern: 'pdf ?(.*)', fromMe: fm, desc: 'Convert images to pdf.', owner: false }, (async (message, match) => {
    if (!fs.existsSync("./pdf")) {
        fs.mkdirSync('./pdf');
    }
    let length = fs.readdirSync('./pdf').length;
    if (length == 0) return await message.sendMessage('```Add pages in order with``` _page_ *command.*');
    let pages = [];
    let i = 1;
    while (i <= length) {
        let path = './pdf/' + i + '.jpeg';
        if (fs.existsSync(path)) {
            pages.push(path);
            i++;
        } else return message.sendMessage('```' + `Missing page ${i}` + '```');
    }
    await message.sendMessage('```Uploading pdf...``` ');
    pdf(pages)
        .pipe(fs.createWriteStream('./pdf.pdf'))
        .on('finish', async () => {
            fsExtra.emptyDirSync('./pdf');
            return await message.sendMessage(fs.readFileSync('pdf.pdf'), { filename: Math.floor(Math.random() * 999999), mimetype: Mimetype.pdf, }, MessageType.document);
        });
}));

Asena.addCommand({ pattern: 'merge ?(.*)', fromMe: true, desc: 'Merge videos' }, (async (message, match) => {
    if (!fs.existsSync("./media/merge")) {
        fs.mkdirSync('./media/merge');
    }
    if (match == '' && !message.reply_message.video) return await message.sendMessage(Lang.NEED_REPLY);
    if (match == '' && isNaN(match)) return await message.sendMessage('*Reply with order number*\n*Ex: .merge 1*');
    if (!isNaN(match)) {
        await message.reply_message.downloadAndSaveMediaMessage('./media/merge/' + match);
        await message.sendMessage('```video ' + match + ' added```');
    }
    if (isNaN(match)) {
        let length = fs.readdirSync('./media/merge').length;
        if (!(length > 0)) return await message.sendMessage('```Add videos in order.```\n*Example .merge 1*');
        await message.sendMessage('```Merging ' + length + ' videos...```');
        let buffer = await mergeVideo(length);
        return await message.sendMessage(buffer, { mimetype: Mimetype.mp4, }, MessageType.video);
    }
}));

Asena.addCommand({ pattern: 'compress ?(.*)', fromMe: true, desc: 'Compress video.' }, (async (message, match) => {
    let location = await message.reply_message.downloadAndSaveMediaMessage('compress');
    let buffer = await getFfmpegBuffer(location, 'ocompress.mp4', 'compress');
    return await message.sendMessage(buffer, MessageType.video);
}));
Asena.addCommand({ pattern: 'unvoice', fromMe: true, desc: "Convert audio to voice note." }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio) return await message.sendMessage("*Reply to a audio*");
    let location = await message.reply_message.downloadAndSaveMediaMessage('unvoice');
    let buffer = await getFfmpegBuffer(location, 'mp3.mp3', 'mp3');
    return await message.sendMessage(buffer, { filename: 'unvoice.mp3', ptt: true, mimetype: 'audio/mpeg', }, MessageType.audio);

}));
Asena.addCommand({ pattern: 'lowmp3', fromMe: true, desc: 'Alter replied audio' }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio) return await message.sendMessage('*Reply to a audio*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('lowmp3');
    let buffer = await getFfmpegBuffer(location, "lowmp3.mp3", 'lowmp3');
    return await message.sendMessage(buffer, { filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', }, MessageType.audio);
}));
Asena.addCommand({ pattern: 'pitchmp3', fromMe: true, desc: "Alter replied audio" }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio) return await message.sendMessage('*Reply to a audio*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('pitchmp3');
    let buffer = await getFfmpegBuffer(location, 'lowmp3.mp3', 'pitch');
    return await message.sendMessage(buffer, { filename: 'lowmp3.mp3', mimetype: 'audio/mpeg', }, MessageType.audio);
}));
Asena.addCommand({ pattern: 'avec', fromMe: true, desc: 'Alter replied audio' }, (async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio) return await message.sendMessage('*Reply to a audio*');
    let location = await message.reply_message.downloadAndSaveMediaMessage('avec');
    let buffer = await getFfmpegBuffer(location, 'avec.mp4', 'avec');
    return await message.sendMessage(buffer, { mimetype: Mimetype.mpeg, }, MessageType.video);
}));

const Asena = require('../Utilis/events');
const { MessageType } = require('@adiwajshing/baileys');
// const config = require('../config');
let fm = true
const { getBuffer, downVideo } = require('../Utilis/download');

Asena.addCommand({ pattern: 'fb ?(.*)', fromMe: fm, desc: "Download facebook video.", owner: false }, (async (message, match) => {
	match = !message.reply_message.txt ? match : message.reply_message.text;
	if (match === '') return await message.sendMessage('```Give me a link.```');
	await message.sendMessage('```Downloading video...```');
	let links = await downVideo(match);
	if (links.length == 0) return await message.sendMessage('*Not found*');
	let { buffer, size } = await getBuffer(links[0]);
	if (size > 90) return await message.sendMessage(`*Video size is ${size} MB*\n*sd link :* ${links[0]}\n\n*HD link :* ${links[1]}`);
	return await message.sendMessage(buffer, { quoted: message.quoted, caption: `*hd link :* ${links[1] || ''}` }, MessageType.video);
}));
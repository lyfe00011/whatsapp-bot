const Asena = require('../Utilis/events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const { getBuffer, igStory } = require('../Utilis/download');
const { instagram } = require('../Utilis/Misc');

Asena.addCommand({ pattern: 'insta ?(.*)', fromMe: true, desc: 'Download from Instagram.', owner: false }, (async (message, match) => {
	match = !message.reply_message.txt ? match : message.reply_message.text;
	if (match === '') return await message.sendMessage('```Give me a link.\nExample:\ninsta https://www.instagram.com/p/...```', { detectLinks: false, quoted: message.data });
	await message.sendMessage('```Downloading media...```');
	let urls = await instagram(match)
	if (!urls) return await message.sendMessage('*Not found!*')
	urls.forEach(async (url) => {
		let { buffer, type } = await getBuffer(url.url || url.data);
		if (type == 'video') await message.sendMessage(buffer, { mimetype: Mimetype.mp4 }, MessageType.video);
		else if (type == 'image') await message.sendMessage(buffer, { mimetype: Mimetype.jpeg }, MessageType.image);
	});
}));

Asena.addCommand({ pattern: 'story ?(.*)', fromMe: true, desc: "Download Instagram story." }, (async (message, match) => {
	match = !message.reply_message.txt ? match : message.reply_message.text;
	if (match === '' || (!match.includes('/stories/') && match.startsWith('http'))) return await message.sendMessage('```Give me a username.```');
	if (match.includes('/stories/')) {
		let s = match.indexOf('/stories/') + 9;
		let e = match.lastIndexOf('/');
		match = match.substring(s, e);
	}
	let json = await igStory(match);
	if (json.error) return await message.sendMessage(json.error);
	if (json.medias.length > 0) {
		await message.sendMessage('```Downloading``` *' + json.medias.length + '* ```stories...```');
		for (let media of json.medias) {
			let { buffer, type } = await getBuffer(media.url);
			if (type == 'video') await message.sendMessage(buffer, { mimetype: Mimetype.mp4 }, MessageType.video);
			else if (type == 'image') await message.sendMessage(buffer, { mimetype: Mimetype.jpeg }, MessageType.image);
		}
	}
}));

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

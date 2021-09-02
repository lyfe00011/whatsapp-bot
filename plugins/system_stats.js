/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../Utilis/events');
const { spawnSync } = require('child_process');
const Config = require('../config');
const Language = require('../language');
const Lang = Language.getString('system_stats');
let fm = true

Asena.addCommand({ pattern: 'alive', fromMe: fm, desc: Lang.ALIVE_DESC }, (async (message, match) => {
    return await message.sendMessage(Config.ALIVE);
}));

Asena.addCommand({ pattern: 'sysd', fromMe: true, desc: Lang.SYSD_DESC }, (async (message, match) => {
    const child = spawnSync('neofetch', ['--stdout']).stdout.toString('utf-8');
    await message.sendMessage('```' + child + '```');
}));
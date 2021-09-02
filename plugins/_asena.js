/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../Utilis/events');
const Config = require('../config');
Asena.addCommand({ pattern: 'list ?(.*)', fromMe: true, dontAddCommandList: true }, (async (message, match) => {
    let CMD_HELP = '';
    Asena.commands.map(
        async (command) => {
            if (command.dontAddCommandList === false && command.pattern !== undefined) {
                try {
                    var match = command.pattern.toString().match(/(\W*)([A-Za-z43ğüşiöç]*)/);
                } catch {
                    var match = [command.pattern];
                }

                let HANDLER = '';

                if (/\[(\W*)\]/.test(Config.HANDLERS)) {
                    HANDLER = Config.HANDLERS.match(/\[(\W*)\]/)[1][0];
                } else {
                    HANDLER = '.';
                }
                CMD_HELP += (match.length >= 3 ? (HANDLER + match[2]) : command.pattern) + (command.desc === '' ? '\n\n' : ' '.repeat(9 - match[2].length) + ' : ');
                if (command.desc !== '') CMD_HELP += command.desc + (command.usage === '' ? '\n\n' : '\n\n');
            }
        });
    return await message.sendMessage('```' + CMD_HELP + '```');
}));

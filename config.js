/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// Özel Fonksiyonlarımız
function convertToBool(text, fault = 'true') { return text === fault ? true : false; };

DATABASE_URL = process.env.DATABASE_URL === undefined ? './whatsasena.db' : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);

module.exports = {
    VERSION: 'v1.0.2',
    SESSION: process.env.ASENA_SESSION === undefined ? '' : process.env.ASENA_SESSION,
    EXT: process.env.EXT === undefined ? undefined : process.env.EXT,
    LANG: process.env.LANGUAGE === undefined ? 'EN' : process.env.LANGUAGE.toUpperCase(),
    HANDLERS: process.env.HANDLERS === undefined ? '^[.]' : process.env.HANDLERS,
    SEND_READ: process.env.SEND_READ === undefined ? false : convertToBool(process.env.SEND_READ),
    BRANCH: 'master',
    HEROKU: {
        HEROKU: process.env.HEROKU === undefined ? false : convertToBool(process.env.HEROKU),
        API_KEY: process.env.HEROKU_API_KEY === undefined ? '' : process.env.HEROKU_API_KEY,
        APP_NAME: process.env.HEROKU_APP_NAME === undefined ? '' : process.env.HEROKU_APP_NAME
    },
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './whatsasena.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: DEBUG }) : new Sequelize(DATABASE_URL,
        {
            host: 'xxxxxx.eu-west-1.compute.amazonaws.com', dialect: 'postgres', ssl: true, protocol: "postgres", logging: DEBUG,
            dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false } }
        }),
    NO_ONLINE: process.env.NO_ONLINE === undefined ? true : convertToBool(process.env.NO_ONLINE),
    CLR_SESSION: process.env.CLR_SESSION === undefined ? false : convertToBool(process.env.CLR_SESSION),
    SUDO: process.env.SUDO === undefined ? false : process.env.SUDO,
    DEBUG: DEBUG,
    WELCOME: process.env.WELCOME === undefined ? 'false' : process.env.WELCOME,
    GOODBYE: process.env.GOODBYE === undefined ? 'false' : process.env.GOODBYE,
    BANBYE: process.env.BANBYE === undefined ? 'false' : process.env.BANBYE,
    WELCOME_JID: process.env.WELCOME_JID === undefined ? 'false' : process.env.WELCOME_JID,
    GOODBYE_JID: process.env.GOODBYE_JID === undefined ? 'false' : process.env.GOODBYE_JID,
    BANBYE_JID: process.env.BANBYE_JID === undefined ? 'false' : process.env.BANBYE_JID,
    AUTO: process.env.AUTO_REMOVE_FAKE === undefined ? false : convertToBool(process.env.AUTO_REMOVE_FAKE),
    ALIVE: process.env.ALIVE_MSG === 'false' ? '*Hey I am HERE*' : process.env.ALIVE_MSG,
    REMOVEBG: process.env.REMOVEBG_KEY === undefined ? "false" : process.env.REMOVEBG_KEY,
    WARN_COUNT: process.env.WARN_COUNT === undefined ? 3 : process.env.WARN_COUNT,
    WARN_MSG: process.env.WARN_MSG === undefined ? "Ok bie" : process.env.WARN_MSG
};
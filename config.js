/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const { Sequelize } = require("sequelize")
const fs = require("fs")
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" })

// Özel Fonksiyonlarımız
function convertToBool(text, fault = "true") {
  return text === fault ? true : false
}

DATABASE_URL =
  process.env.DATABASE_URL === undefined
    ? "./whatsasena.db"
    : process.env.DATABASE_URL
DEBUG =
  process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG)

module.exports = {
  VERSION: "v1.2.8",
  SESSION:
    process.env.ASENA_SESSION === undefined ? "" : process.env.ASENA_SESSION,
  EXT: process.env.EXT === undefined ? undefined : process.env.EXT,
  LANG:
    process.env.LANGUAGE === undefined
      ? "EN"
      : process.env.LANGUAGE.toUpperCase(),
  HANDLERS: process.env.HANDLERS === undefined ? "^[.]" : process.env.HANDLERS,
  SEND_READ:
    process.env.SEND_READ === undefined
      ? false
      : convertToBool(process.env.SEND_READ),
  BRANCH: "master",
  HEROKU: {
    HEROKU:
      process.env.HEROKU === undefined
        ? false
        : convertToBool(process.env.HEROKU),
    API_KEY:
      process.env.HEROKU_API_KEY === undefined
        ? ""
        : process.env.HEROKU_API_KEY,
    APP_NAME:
      process.env.HEROKU_APP_NAME === undefined
        ? ""
        : process.env.HEROKU_APP_NAME,
  },
  DATABASE_URL: DATABASE_URL,
  DATABASE:
    DATABASE_URL === "./whatsasena.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: DEBUG,
        })
      : new Sequelize(DATABASE_URL, {
          host: "xxxxxx.eu-west-1.compute.amazonaws.com",
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          logging: DEBUG,
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
        }),
  NO_ONLINE:
    process.env.NO_ONLINE === undefined
      ? true
      : convertToBool(process.env.NO_ONLINE),
  CLR_SESSION:
    process.env.CLR_SESSION === undefined
      ? false
      : convertToBool(process.env.CLR_SESSION),
  SUDO: process.env.SUDO === undefined ? false : process.env.SUDO,
  DEBUG: DEBUG,
  REMOVEBG:
    process.env.REMOVEBG_KEY === undefined ? "false" : process.env.REMOVEBG_KEY,
  WARN_COUNT: process.env.WARN_COUNT === undefined ? 3 : process.env.WARN_COUNT,
  WARN_MSG:
    process.env.WARN_MSG === undefined ? "Ok bie" : process.env.WARN_MSG,
  ANTIJID: process.env.ANTIJID === undefined ? "" : process.env.ANTIJID,
  STICKER_PACKNAME:
    process.env.STICKER_PACKNAME === undefined
      ? "🥰,lyfe00011"
      : process.env.STICKER_PACKNAME,
  BRAINSHOP:
    process.env.BRAINSHOP === undefined
      ? "159501,6pq8dPiYt7PdqHz3"
      : process.env.BRAINSHOP,
  DIS_BOT:
    process.env.DISABLE_BOT === undefined ? "null" : process.env.DISABLE_BOT,
  FIND_API_KEY:
    process.env.FIND_API_KEY === undefined
      ? "null"
      : process.env.FIND_API_KEY,
}

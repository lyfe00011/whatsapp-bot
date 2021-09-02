/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/
const fs = require("fs");
const path = require("path");
const { handleMessages } = require("./Utilis/msg");
const chalk = require("chalk");
const { DataTypes } = require("sequelize");
const config = require("./config");
const {
    WAConnection,
    MessageType,
} = require("@adiwajshing/baileys");
const { StringSession } = require("./Utilis/whatsasena");
const { getJson } = require("./Utilis/download");
const { groupMuteSchuler, customMessageScheduler } = require("./Utilis/schedule");
const { prepareGreetingMedia } = require("./Utilis/greetings");
const { updateChecker } = require("./plugins/update");
// Sql

const WhatsAsenaDB = config.DATABASE.define("WhatsAsena", {
    info: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

fs.readdirSync("./plugins/sql/").forEach((plugin) => {
    if (path.extname(plugin).toLowerCase() == ".js") {
        require("./plugins/sql/" + plugin);
    }
});

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != "undefined" ? args[i++] : "";
    });
};

if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
}

Array.prototype.remove = function () {
    var what,
        a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena(version) {
    await config.DATABASE.sync();
    let StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
            info: "StringSession",
        },
    });
    const conn = new WAConnection();
    conn.version = version || [2, 2132, 6];
    const Session = new StringSession();
    conn.logger.level = config.DEBUG ? "debug" : "warn";
    var nodb;

    if (StrSes_Db.length < 1 || config.CLR_SESSION) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION));
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    // conn.on('credentials-updated', async () => {
    conn.on("open", async () => {
        console.log(chalk.blueBright.italic("✅ Login information updated!"));

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({
                info: "StringSession",
                value: Session.createStringSession(authInfo),
            });
        } else {
            await StrSes_Db[0].update({
                value: Session.createStringSession(authInfo),
            });
        }
    });
    conn.on("connecting", async () => {
        console.log(`${chalk.red.bgBlack("B")}${chalk.green.bgBlack(
            "o"
        )}${chalk.blue.bgBlack("t")}${chalk.yellow.bgBlack(
            "t"
        )}${chalk.white.bgBlack("u")}${chalk.magenta.bgBlack("s")}
${chalk.white.bold.bgBlack("Version:")} ${chalk.red.bold.bgBlack(
            config.VERSION
        )}
${chalk.blue.italic.bgBlack("ℹ️ Connecting to WhatsApp... Please wait.")}`);
    });
    conn.on("open", async () => {
        console.log(chalk.green.bold("✅ Login successful!"));
        console.log(chalk.blueBright.italic("⬇️  Installing plugins..."));

        fs.readdirSync("./plugins").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() == ".js") {
                require("./plugins/" + plugin);
            }
        });

        console.log(chalk.green.bold("✅ Plugins installed!"));
        await conn.sendMessage(conn.user.jid, "*Bot Started*", MessageType.text);
        let update = await updateChecker()
        if (update !== false) await conn.sendMessage(conn.user.jid, "```New updates available```\n\n" + update, MessageType.text);
    });
    conn.on("close", async (e) =>
        console.log(
            `Connection close reason :  ${e.reason}, isReconnectiong : ${e.isReconnecting}`
        )
    );

    await groupMuteSchuler(conn);
    await customMessageScheduler(conn);

    conn.on("chat-update", async (m) => {
        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        const { messages } = m;
        const all = messages.all()
        await handleMessages(all[0], conn);
    })

    try {
        await conn.connect();
    } catch (e) {
        if (!nodb) {
            console.log(chalk.red.bold("Eski sürüm stringiniz yenileniyor..."));
            conn.loadAuthInfo(Session.deCrypt(config.SESSION));
            try {
                await conn.connect();
            } catch (e) {
                return;
            }
        } else console.log(`${e.message}`);
    }
}

async function lastestVersion() {
    await prepareGreetingMedia();
    let { currentVersion } = await getJson('https://web.whatsapp.com/check-update?version=2.2123.8&platform=web')
    currentVersion = currentVersion.split('.')
    currentVersion = [+currentVersion[0], +currentVersion[1], +currentVersion[2]]
    whatsAsena(currentVersion);
} lastestVersion();


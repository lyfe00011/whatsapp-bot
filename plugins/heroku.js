/* 
Heroku plugin for WhatsAsena - W4RR10R
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events");
const Config = require("../config");
const Heroku = require("heroku-client");
const { secondsToHms } = require("./afk");
const got = require("got");
const Language = require("../language");
// const { MessageType } = require('@adiwajshing/baileys');
const Lang = Language.getString("heroku");

const heroku = new Heroku({
  token: Config.HEROKU.API_KEY,
});

let baseURI = "/apps/" + Config.HEROKU.APP_NAME;

Asena.addCommand(
  { pattern: "restart", fromMe: true, desc: Lang.RESTART_DESC },
  async (message, match) => {
    await message.sendMessage(Lang.RESTART_MSG);
    console.log(baseURI);
    await heroku.delete(baseURI + "/dynos").catch(async (error) => {
      await message.sendMessage(error.message);
    });
  }
);

Asena.addCommand(
  { pattern: "shutdown", fromMe: true, desc: Lang.SHUTDOWN_DESC },
  async (message, match) => {
    await heroku
      .get(baseURI + "/formation")
      .then(async (formation) => {
        forID = formation[0].id;
        await message.sendMessage(Lang.SHUTDOWN_MSG);
        await heroku.patch(baseURI + "/formation/" + forID, {
          body: {
            quantity: 0,
          },
        });
      })
      .catch(async (err) => {
        await message.sendMessage(error.message);
      });
  }
);

Asena.addCommand(
  { pattern: "dyno", fromMe: true, desc: Lang.DYNO_DESC },
  async (message, match) => {
    heroku.get("/account").then(async (account) => {
      // have encountered some issues while calling this API via heroku-client
      // so let's do it manually
      url =
        "https://api.heroku.com/accounts/" + account.id + "/actions/get-quota";
      headers = {
        "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
        Authorization: "Bearer " + Config.HEROKU.API_KEY,
        Accept: "application/vnd.heroku+json; version=3.account-quotas",
      };
      await got(url, { headers: headers })
        .then(async (res) => {
          const resp = JSON.parse(res.body);
          total_quota = Math.floor(resp.account_quota);
          quota_used = Math.floor(resp.quota_used);
          percentage = Math.round((quota_used / total_quota) * 100);
          remaining = total_quota - quota_used;
          await message.sendMessage(
            Lang.DYNO_TOTAL +
              ": ```{}```\n\n".format(secondsToHms(total_quota)) +
              Lang.DYNO_USED +
              ": ```{}```\n".format(secondsToHms(quota_used)) +
              Lang.PERCENTAGE +
              ": ```{}```\n\n".format(percentage) +
              Lang.DYNO_LEFT +
              ": ```{}```\n".format(secondsToHms(remaining))
          );
        })
        .catch(async (err) => {
          await message.sendMessage(err.message);
        });
    });
  }
);

Asena.addCommand(
  { pattern: "setvar ?(.*)", fromMe: true, desc: Lang.SETVAR_DESC },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.KEY_VAL_MISSING);
    if ((varKey = match.split(":")[0]) && (varValue = match.split(":")[1])) {
      await heroku
        .patch(baseURI + "/config-vars", {
          body: {
            [varKey]: varValue,
          },
        })
        .then(async (app) => {
          await message.sendMessage(Lang.SET_SUCCESS.format(varKey, varValue));
        });
    } else {
      await message.sendMessage(Lang.INVALID);
    }
  }
);

Asena.addCommand(
  { pattern: "delvar ?(.*)", fromMe: true, desc: Lang.DELVAR_DESC },
  async (message, match) => {
    if (match === "") return await message.reply(Lang.KEY_VAL_MISSING);
    await heroku
      .get(baseURI + "/config-vars")
      .then(async (vars) => {
        key = match.trim();
        for (vr in vars) {
          if (key == vr) {
            await heroku.patch(baseURI + "/config-vars", {
              body: {
                [key]: null,
              },
            });
            return await message.sendMessage(Lang.DEL_SUCCESS.format(key));
          }
        }
        await message.sendMessage(Lang.NOT_FOUND);
      })
      .catch(async (error) => {
        await message.sendMessage(error.message);
      });
  }
);

Asena.addCommand(
  { pattern: "getvar ?(.*)", fromMe: true, desc: Lang.GETVAR_DESC },
  async (message, match) => {
    if (match === "") return await message.reply(Lang.KEY_VAL_MISSING);
    await heroku
      .get(baseURI + "/config-vars")
      .then(async (vars) => {
        for (vr in vars) {
          if (match.trim() == vr)
            return await message.sendMessage(
              "```{} - {}```".format(vr, vars[vr])
            );
        }
        await message.sendMessage(Lang.NOT_FOUND);
      })
      .catch(async (error) => {
        await message.sendMessage(error.message);
      });
  }
);

Asena.addCommand(
  { pattern: "allvar", fromMe: true, desc: "Shows all vars in Heroku." },
  async (message, match) => {
    let msg = "```Here your all Heroku vars\n\n\n";
    await heroku
      .get(baseURI + "/config-vars")
      .then(async (keys) => {
        for (let key in keys) {
          msg += `${key} : ${keys[key]}\n\n`;
        }
        return await message.sendMessage(msg + "```");
      })
      .catch(async (error) => {
        await message.sendMessage(error.message);
      });
  }
);

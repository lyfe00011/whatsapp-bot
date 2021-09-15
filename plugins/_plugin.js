/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events");
const got = require("got");
const fs = require("fs");
const { installPlugin, PluginDB } = require("./sql/plugin");
const Language = require("../language");
const Lang = Language.getString("_plugin");

Asena.addCommand(
  { pattern: "plugin ?(.*)", fromMe: true, desc: Lang.INSTALL_DESC },
  async (message, match) => {
    if (match === "" && match !== "list")
      return await message.sendMessage(Lang.NEED_URL);
    if (match == "list") {
      let mesaj = Lang.INSTALLED_FROM_REMOTE;
      let plugins = await PluginDB.findAll();
      if (plugins.length < 1) {
        return await message.sendMessage(Lang.NO_PLUGIN);
      } else {
        plugins.map((plugin) => {
          mesaj +=
            "*" + plugin.dataValues.name + "*: " + plugin.dataValues.url + "\n";
        });
        return await message.sendMessage(mesaj);
      }
    }
    try {
      var url = new URL(match);
    } catch {
      return await message.sendMessage(Lang.INVALID_URL);
    }

    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }

    let response = await got(url);
    if (response.statusCode == 200) {
      var plugin_name = (/pattern: ['"](.*)["']/g).exec(response.body)
      if (plugin_name.length >= 1) {
        plugin_name = plugin_name[1].split(" ")[0];
      } else {
        plugin_name = Math.random().toString(36).substring(8);
      }

      fs.writeFileSync("./plugins/" + plugin_name + ".js", response.body);
      try {
        require("./" + plugin_name);
      } catch (e) {
        fs.unlinkSync("./" + plugin_name);
        return await message.sendMessage(
          Lang.INVALID_PLUGIN + " ```" + e + "```"
        );
      }

      await installPlugin(url, plugin_name);
      await message.sendMessage(Lang.INSTALLED);
    }
  }
);

Asena.addCommand(
  { pattern: "remove (.*)", fromMe: true, desc: Lang.REMOVE_DESC },
  async (message, match) => {
    if (match === "") return await message.sendMessage(Lang.NEED_PLUGIN);
    let plugin = await PluginDB.findAll({ where: { name: match } });
    if (plugin.length < 1) {
      return await message.sendMessage(Lang.NOT_FOUND_PLUGIN);
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync("./plugins/" + match + ".js");
      return await message.sendMessage(Lang.DELETED);
    }
  }
);

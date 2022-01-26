/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require("../Utilis/events")
const got = require("got")
const fs = require("fs")
const { parseGistUrls, pluginList } = require("../Utilis/Misc")
const { installPlugin, getPlugin, deletePlugin } = require("../Utilis/plugins")
const Language = require("../language")
const Lang = Language.getString("_plugin")

Asena.addCommand(
  { pattern: "plugin ?(.*)", fromMe: true, desc: Lang.INSTALL_DESC },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match && match !== "list")
      return await message.sendMessage(Lang.NEED_URL)
    if (match == "list") {
      const plugins = await getPlugin()
      if (!plugins) return await message.sendMessage(Lang.NO_PLUGIN)
      return await message.sendMessage(
        `${Lang.INSTALLED_FROM_REMOTE}\n${plugins}`
      )
    }
    const isValidUrl = parseGistUrls(match)
    if (!isValidUrl) return await message.sendMessage(Lang.INVALID_URL)
    for (const url of isValidUrl) {
      try {
        const res = await got(url)
        if (res.statusCode == 200) {
          let plugin_name = /pattern: ["'](.*)["'],/g.exec(res.body)
          plugin_name = plugin_name[1].split(" ")[0]
          fs.writeFileSync("./plugins/" + plugin_name + ".js", res.body)
          try {
            require("./" + plugin_name)
          } catch (e) {
            await message.sendMessage(
              Lang.INVALID_PLUGIN + "```\n" + e.stack + "```"
            )
            return fs.unlinkSync("./plugins/" + plugin_name + ".js")
          }
          await installPlugin(url, plugin_name)
          await message.sendMessage(
            Lang.INSTALLED.format(pluginList(res.body).join(","))
          )
        }
      } catch (error) {
        await message.sendMessage(`${error}\n${url}`)
      }
    }
  }
)

Asena.addCommand(
  { pattern: "remove (.*)", fromMe: true, desc: Lang.REMOVE_DESC },
  async (message, match) => {
    if (!match) return await message.sendMessage(Lang.NEED_PLUGIN)
    const isDeleted = await deletePlugin(match)
    if (!isDeleted) return await message.sendMessage(Lang.NOT_FOUND_PLUGIN)
    delete require.cache[require.resolve("./" + match + ".js")]
    fs.unlinkSync("./plugins/" + match + ".js")
    return await message.sendMessage(Lang.DELETED)
  }
)

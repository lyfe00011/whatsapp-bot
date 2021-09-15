const Asena = require("../Utilis/events");
const { MessageType } = require("@adiwajshing/baileys");
const { getJson, TiktokDownloader } = require("../Utilis/download");
const { UploadToImgur, wallpaper, forward } = require("../Utilis/Misc");
const Language = require("../language");
const Lang = Language.getString("tiktok");
Asena.addCommand(
  { pattern: "tiktok ?(.*)", fromMe: true, desc: Lang.TIKTOK_DESC },
  async (message, match) => {
    match = !message.reply_message ? match : message.reply_message.text;
    if (match == "")
      return await message.sendMessage(Lang.NEED_REPLY, {
        quoted: message.data,
      });
    let link = await TiktokDownloader(match);
    if (!link)
      return await message.sendMessage(Lang.INVALID, {
        quoted: message.data,
      });
    let { buffer } = await getBuffer(link);
    return await message.sendMessage(buffer, {}, MessageType.video);
  }
);

Asena.addCommand(
  { pattern: "movie ?(.*)", fromMe: true, desc: Lang.MOVIE_DESC },
  async (message, match) => {
    if (match === "")
      return await message.sendMessage(Lang.NEED_NAME, {
        quoted: message.data,
      });
    let url = `http://www.omdbapi.com/?apikey=742b2d09&t=${match}&plot=full`;
    const json = await getJson(url);
    if (json.Response != "True")
      return await message.sendMessage(Lang.NOT_FOUND, {
        quoted: message.data,
      });
    let msg = "";
    msg += "```Title      : " + json.Title + "\n\n";
    msg += "Year       : " + json.Year + "\n\n";
    msg += "Rated      : " + json.Rated + "\n\n";
    msg += "Released   : " + json.Released + "\n\n";
    msg += "Runtime    : " + json.Runtime + "\n\n";
    msg += "Genre      : " + json.Genre + "\n\n";
    msg += "Director   : " + json.Director + "\n\n";
    msg += "Writer     : " + json.Writer + "\n\n";
    msg += "Actors     : " + json.Actors + "\n\n";
    msg += "Plot       : " + json.Plot + "\n\n";
    msg += "Language   : " + json.Language + "\n\n";
    msg += "Country    : " + json.Country + "\n\n";
    msg += "Awards     : " + json.Awards + "\n\n";
    msg += "BoxOffice  : " + json.BoxOffice + "\n\n";
    msg += "Production : " + json.Production + "\n\n";
    msg += "imdbRating : " + json.imdbRating + "\n\n";
    msg += "imdbVotes  : " + json.imdbVotes + "```";
    return await message.sendMessage(msg);
  }
);

Asena.addCommand(
  { pattern: "forward ?(.*)", fromMe: true, desc: Lang.FORWARD_DESC },
  async (message, match) => {
    if (match == "") return await message.sendMessage(Lang.JID);
    if (!message.reply_message) return await message.sendMessage(Lang.FORWARD);
    if (match.length > 30) return await message.sendMessage("*Check jid*");
    const { jid, buffer, type, options } = await forward(match, message);
    return await message.client.sendMessage(jid, buffer, type, options);
  }
);

Asena.addCommand(
  {
    pattern: "wallpaper ?(.*)",
    fromMe: true,
    desc: Lang.WALLPAPER_DESC,
  },
  async (message, match) => {
    if (match == "") return message.sendMessage(Lang.NEED_NAME);
    let buffer = await wallpaper(match);
    if (!buffer) return await message.sendMessage(Lang.NOT_FOUND);
    return await message.sendMessage(
      buffer,
      { quoted: message.data },
      MessageType.image
    );
  }
);

Asena.addCommand(
  { pattern: "url", fromMe: true, desc: Lang.URL_DESC },
  async (message, match) => {
    if (
      !message.reply_message ||
      (!message.reply_message.image && !message.reply_message.video)
    )
      return await message.sendMessage(Lang.URL_NEED_REPLY);
    if (message.reply_message.length > 10)
      return await message.sendMessage("*Only accept below 10 MB*");
    let location = await message.reply_message.downloadAndSaveMediaMessage(
      "url"
    );
    let url = await UploadToImgur(location);
    return await message.sendMessage(url, { quoted: message.data });
  }
);

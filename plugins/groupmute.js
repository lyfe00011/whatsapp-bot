const Asena = require("../Utilis/events");
const {
  getMute,
  setMute,
  getUnmute,
  setUnmute,
  getEachUnmute,
  getEachMute,
} = require("../Utilis/groupmute");

Asena.addCommand(
  {
    pattern: "automute ?(.*)",
    fromMe: true,
    desc: "Mute Schedule.",
    owner: false,
  },
  async (message, match) => {
    if (match == "" && !message.reply_message) {
      return await message.sendMessage('*Reply to a Message*```' + `Example 
.automute jid hour minute
hour 0-23
minute 0-59
            
.automute jid
for get details
            
.automute jid off
to disable unmute
      
.automute list
To get all` + '```');
    }
    let msg = message.reply_message.text;
    let [user, hours, minute] = match.split(" ");
    if (user == "list") {
      let all = await getEachMute();
      if(!all) return await message.sendMessage("*Nothing to Display*")
      let msg = "";
      all.forEach((jids) => {
        let { jid, message, hour, minute, onoroff } = jids;
        msg += `Jid     : ${jid}\nMessage : ${message}\nHour    : ${hour}\nMinute  : ${minute}\nEnabled : ${onoroff}\n\n`;
      });
      return await message.sendMessage("```" + msg + "```");
    }
    if (user != undefined && !message.reply_message.txt && hours == undefined) {
      let info = await getMute(user);
      let { jid, message: msgs, hour, minute, onoroff } = info;
      return await message.sendMessage(`
Jid: ${jid}
Message: ${msgs}
Hour: ${hour}
Minute: ${minute}
Enabled: ${onoroff}`);
    } else if (
      user != undefined &&
      hours != undefined &&
      (hours == "on" || hours == "off")
    ) {
      let info = await getMute(user);
      if (info == false) return await message.sendMessage("*Not Found*");
      let { jid, message: msgs, hour, minute } = info;
      await setMute(user, msgs, hour, minute, hours == "on" ? true : false);
      return await message.sendMessage(`Jid: ${jid}
Message: ${msgs}
Hour: ${hour}
Minute: ${minute}
Enabled: ${hours}\n\n*Restart bot*`);
    } else if (!user || !msg || !hours || !minute) {
      return await message.sendMessage("*Syntax Error!*");
    } else {
      await setMute(user, msg, hours, minute, true);
      return await message.sendMessage(
        `Muted ${user} for ${hours} ${minute}\n\n*Restart bot*`
      );
    }
  }
);

Asena.addCommand(
  {
    pattern: "autoumute ?(.*)",
    fromMe: true,
    desc: "Unmute Schedule.",
    owner: false,
  },
  async (message, match) => {
    if (match == "" && !message.reply_message) {
      return await message.sendMessage('*Reply to a Message*```' + `Example 
.autoumute jid hour minute
hour 0-23
minute 0-59
            
.autoumute jid
for get details
            
.autoumute jid off
to disable unmute
      
.autoumute list
To get all` + '```')
    }
    let msg = message.reply_message.text;
    let [user, hours, minute] = match.split(" ");
    if (user == "list") {
      let all = await getEachUnmute();
      if(!all) return await message.sendMessage("*Nothing to Display*")
      let msg = "";
      all.forEach((jids) => {
        let { jid, message, hour, minute, onoroff } = jids;
        msg += `Jid     : ${jid}\nMessage : ${message}\nHour    : ${hour}\nMinute  : ${minute}\nEnabled : ${onoroff}\n\n`;
      });
      return await message.sendMessage("```" + msg + "```");
    }
    if (user != undefined && !message.reply_message.txt && hours == undefined) {
      let info = await getUnmute(user);
      let { jid, message: msgs, hour, minute, onoroff } = info;
      return await message.sendMessage(`
Jid: ${jid}
Message: ${msgs}
Hour: ${hour}
Minute: ${minute}
Enabled: ${onoroff}`);
    } else if (
      user != undefined &&
      hours != undefined &&
      (hours == "on" || hours == "off")
    ) {
      let info = await getUnmute(user);
      if (info == false) return await message.sendMessage("*Not Found*");
      let { jid, message: msgs, hour, minute } = info;
      await setUnmute(user, msgs, hour, minute, hours == "on" ? true : false);
      return await message.sendMessage(`Jid: ${jid}
Message: ${msgs}
Hour: ${hour}
Minute: ${minute}
Enabled: ${hours}\n\n*Restart bot*`);
    } else if (!user || !msg || !hours || !minute) {
      return await message.sendMessage("*Syntax Error!*");
    } else {
      await setUnmute(user, msg, hours, minute, true);
      return await message.sendMessage(
        `Unmuted ${user} for ${hours} ${minute}\n\n*Restart bot*`
      );
    }
  }
);

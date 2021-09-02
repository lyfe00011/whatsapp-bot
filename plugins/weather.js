/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/
// const Config = require('../config');
const Asena = require('../Utilis/events');
const Language = require('../language');
const Lang = Language.getString('weather');
// const config = require('../config');
const moment = require('moment');
const { getJson } = require('../Utilis/download');

Asena.addCommand({ pattern: 'weather ?(.*)', fromMe: true, desc: Lang.WEATHER_DESC, usage: 'weather Bakü', owner: false }, (async (message, match) => {
   if (match === '') return await message.sendMessage(Lang.NEED_LOCATION);
   const url = `http://api.openweathermap.org/data/2.5/weather?q=${match}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;
   const json = await getJson(url);
   if (!json) return await message.sendMessage(Lang.NOT_FOUND);
   let o = json.timezone;
   let h = json.sys.sunrise;
   h = h + o;
   p = moment.unix(h);
   let a = json.sys.sunset;
   a = a + o;
   q = moment.unix(a);
   let i = moment.utc(p).format("h:mmA");
   let j = moment.utc(q).format("h:mmA");
   let weather = '```' + Lang.LOCATION + '    : ' + json.name + '\n';
   weather += 'Country     : ' + json.sys.country + '\n';
   weather += Lang.TEMP + ' : ' + json.main.temp + '°\n';
   weather += Lang.FTEMP + '  : ' + json.main.feels_like + '°\n';
   weather += Lang.DESC + ' : ' + json.weather[0].description + '\n';
   weather += Lang.HUMI + '    : ' + json.main.humidity + '%\n';
   weather += Lang.WIND + '  : ' + json.wind.speed + ' m/s ' + (json.wind.deg < 23 ? 'N' : json.wind.deg < 68 ? 'NE' : json.wind.deg < 113 ? 'E' : json.wind.deg < 158 ? 'SE' : json.wind.deg < 203 ? 'S' : json.wind.deg < 248 ? 'SW' : json.wind.deg < 293 ? 'W' : 'NW') + '\n';
   weather += Lang.CLOUD + '       : ' + json.clouds.all + '%\n';
   weather += Lang.VISI + '  : ' + json.visibility + 'm\n';
   weather += Lang.SRISE + '     : ' + i + '\n';
   weather += Lang.SET + '      : ' + j + '```';
   return await message.sendMessage(weather);
}));

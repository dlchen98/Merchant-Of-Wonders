
//discord stuff
const Discord = require("discord.js");
const client = new Discord.Client();
//access the bot token
const settings = require("./settings.json");

//login message
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(settings.token);

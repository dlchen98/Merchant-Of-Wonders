
//discord stuff
const Discord = require("discord.js");
const client = new Discord.Client();
//access the bot token
const settings = require("./settings.json");

var http = require("http");

//prefix for bot commands
const prefix = ">merch";

//access the market functions
var marketFunctions = require("./marketFunctions.js");

//login message
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  //only continue if the bot prefix is used
  if (!msg.content.startsWith(prefix)) return;
  //save any extra args after the prefix
  var args = msg.content.split(' ').slice(1);
  //concatonate all the extra args TODO: is this necessary?
  var result = args.join(' ');

  if (args[0] != null) {
    //check current market price
    marketFunctions.currMarketQuery(Discord, http, args, msg);
  }
});

//login with the token
client.login(settings.token);

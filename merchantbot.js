
//discord stuff
const Discord = require("discord.js");
const client = new Discord.Client();
//access the bot token
const settings = require("./settings.json");

var https = require("https");

//prefix for bot commands
const prefix = ">merch";

//access the market functions
var market = require("./marketFunctions.js");
//access general functions
var basics = require("./basicFunctions.js");

//login message
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  //only continue if the bot prefix is used
  if (!msg.content.startsWith(prefix)) return;
  //save any extra args after the prefix as array
  var args = msg.content.split(' ').slice(1);
  //concatonate all the extra args TODO: is this necessary?
  var result = args.join(' ');

  switch (args[0]) {
    //print command list
    case "help":
      basics.listHelp(msg);
      break;
    //calculate max bid of an item
    case "bid":
      //remove the 'bid' argument
      args.shift();
      market.bidQuery(Discord, https, args, msg);
      break;
    //if no item, error message
    case undefined:
    case null:
    case "":
      msg.channel.send("Please use '>merch help' if lost.");
      break;
    //check current market price
    default:
      market.currMarketQuery(Discord, https, args, msg);
  }

});

//login with the token
client.login(settings.token);

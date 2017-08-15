//use the basicFunctions
var basics = require("./basicFunctions.js");
//use mongodb functions
var mongo = require("./mongoFunctions.js");
//access some URLs
var settings = require("./settings.json");
//use node mongodb stuff
var mongodb = require("mongodb").MongoClient;

//store the various market functions of the merchant of wonders
module.exports = {
  sendEmbeddedMarketPrice(Discord, itemImage, requestBody, msg) {

    //create the embed msg
    var embed = new Discord.RichEmbed()
      //title=itemName
      .setTitle(requestBody[0].name)
      //author=the bot
      .setAuthor("North America BnS Market")
      //a nice green bar thing
      .setColor(0x00AE86)
      //last time minimum price updated
      .setDescription("Last Updated: " + new Date(requestBody[0].ISO).toLocaleString())
      //raven soul thumbnail
      .setThumbnail(itemImage)
      .setTimestamp()
      //link to the item API data
      .setURL(settings.embedURL+requestBody[0].id)
      .addField("Current Lowest:",
        basics.priceParse(requestBody[0].listings[0].price))
      .addField("Second Lowest:",
        basics.priceParse(requestBody[0].listings[1].price))
      .addField("Third Lowest:",
        basics.priceParse(requestBody[0].listings[2].price));

    //send the embed
    msg.channel.send({embed});
  },

  currMarketQuery(Discord, http, itemName, msg) {
    //allow marketFunction usage inside callbacks in this method
    var me = this;
    //parse itemName for mongoDB search
    //should be in this format "\"raven\" \"soul\""
    // var mongoItemName = "";
    // itemName.forEach(function(itemBit) {
    //   mongoItemName += "\"" + itemBit + "\" ";
    // });

    //connect to the mongoAtlas DB
    mongodb.connect(settings.mongoURI, function(err, db) {
      //print db connection errors
      if (err) console.log(err);

      //findItem finds the id and picLink
      mongo.findItem(itemName, msg, db, function(item) {

        //formating for API request
        var options = {
          hostname: settings.queryHostURL,
          port: 80,
          path: settings.queryPathURL + item.id,
          method: "GET"
        };

        //get request to silver's API
        var req = http.request(options, function(res) {
          //store the JSON object
          var requestBody;

          //encode it as UTF-8, not binary default
          res.setEncoding("UTF-8");

          //action when it recieves market data
          //silver's API sends one JSON object
          res.once("data", function(itemData) {
            //parse the JSON to be readable
            requestBody = JSON.parse(itemData);
            //parse the JSON and send the msg
            me.sendEmbeddedMarketPrice(Discord, item.img, requestBody, msg);
          });
        });
        //end the request
        req.end();
      });

      //close db connection
      db.close();
    });

  }
}

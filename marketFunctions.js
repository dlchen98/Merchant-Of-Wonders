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
      //item thumbnail
      .setThumbnail(itemImage)
      .setTimestamp()
      //link to the item API data
      .setURL(settings.embedURL+requestBody[0].id)
      //true makes the fields inLine (2 fields per row)
      .addField("Current Lowest (Count):",
        basics.priceParse(requestBody[0].listings[0])
          + "(" + requestBody[0].listings[0].count + ")", true);

    //add up to 2 more prices if they exist
    for (var count = 1; count < 3; count++) {
      if (requestBody[0].listings[count] != null) {
        embed.addField("Next Lowest (Count):",
          basics.priceParse(requestBody[0].listings[count])
            + "(" + requestBody[0].listings[count].count + ")", true);
      }
    }

    //send the embed
    msg.channel.send({embed});
  },

  currMarketQuery(Discord, https, itemName, msg) {
    //allow marketFunction usage inside callbacks in this method
    var me = this;

    //connect to the mongoAtlas DB
    mongodb.connect(settings.mongoURI, function(err, db) {
      //print db connection errors
      if (err) console.log(err);

      //findItem finds the id and picLink
      mongo.findItem(itemName, msg, db, function(item) {

        //formating for API request
        var options = {
          hostname: settings.queryHostURL,
          port: 443,
          path: settings.queryPathURL + item.id,
          method: "GET"
        };

        //get request to silver's API
        var req = https.request(options, function(res) {
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

  },

  bidQuery(Discord, https, itemName, msg) {

    //connect to the mongoAtlas DB
    mongodb.connect(settings.mongoURI, function(err, db) {
      //print db connection errors
      if (err) console.log(err);

      //findItem finds the id and picLink
      mongo.findItem(itemName, msg, db, function(item) {

        //formating for API request
        var options = {
          hostname: settings.queryHostURL,
          port: 443,
          path: settings.queryPathURL + item.id,
          method: "GET"
        };

        //get request to silver's API
        var req = https.request(options, function(res) {
          //store the JSON object
          var requestBody;

          //encode it as UTF-8, not binary default
          res.setEncoding("UTF-8");

          //action when it recieves market data
          //silver's API sends one JSON object
          res.once("data", function(itemData) {
            //parse the JSON to be readable
            requestBody = JSON.parse(itemData);

            //check if theres a price on market
            if (requestBody[0].listings[0] == null) {
              msg.channel.send("There's no prices on the market to compare to.");
              return;
            }

            //TODO calculate bid shit

            //maxPrice object for the item
            //market price * party member count * base market taxes
            var maxPrice = {
              price : Math.trunc(requestBody[0].listings[0].price * 5/6 * 0.95),
              count : 1
            };

            //create the embed msg
            var embed = new Discord.RichEmbed()
              //title=itemName
              .setTitle(requestBody[0].name)
              //author=the bot
              .setAuthor("North American BnS Max Bid Calculator")
              //a nice green bar thing
              .setColor(0x00AE86)
              //last time minimum price updated
              .setDescription("Last Updated: " + new Date(requestBody[0].ISO).toLocaleString()
                + "\nNotes: This is strictly for 6man parties and only does calculations for "
                + "5 or less items without premium. There's an extra 1% tax for any sale "
                + "after 100g of total sale earnings unaccounted for here. (for now)")
              //item thumbnail
              .setThumbnail(item.img)
              .setTimestamp()
              //link to the item API data
              .setURL(settings.embedURL+requestBody[0].id)
              //true makes the fields inLine (2 fields per row)
              .addField("Max Bid:",
              //TODO
                basics.priceParse(maxPrice), true)
              .addField("Lowest Unit Price:",
                basics.priceParse(requestBody[0].listings[0]), true);

              msg.channel.send({embed});
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

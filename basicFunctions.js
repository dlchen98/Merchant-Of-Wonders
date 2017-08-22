module.exports = {
  //takes the price value from the JSON array and parses it
  priceParse(listingObject) {
    //calculate the unit price
    strPrice = (listingObject.price / listingObject.count).toString();
    //return unit price
    return strPrice.substring(0, strPrice.length-4) + "<:bns_gold:345286922412752897>"
      + strPrice.substring(strPrice.length-4, strPrice.length-2) + "<:bns_silver:345286933494366208>"
      + strPrice.substring(strPrice.length-2, strPrice.length) + "<:bns_copper:345286894516568066>";
  },

  listHelp(msg) {
    //start the code block format
    var responseString = "```";

    responseString += "Merchant of Wonders BnS NA Bot Functions";
    responseString += "Please use '>merch' before any command\n\n";

    responseString += "(item name)\tfind current market prices of said item\n"
    responseString += "ex. '>merch pet stone' returns current pet stone prices\n"

    //end the code block and send it in discord
    responseString += "```";
    msg.channel.reply(responseString);
  }

}

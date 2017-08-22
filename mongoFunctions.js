module.exports = {
  findItem (itemName, msg, db, callback) {

    //parse itemName for mongoDB search
    //should be in this format "\"raven\" \"soul\""
    var mongoItemName = "";
    itemName.forEach(function(itemBit) {
      mongoItemName += "\"" + itemBit + "\" ";
    });

    // Get the item collection
    var collection = db.collection('items');
    // Find the item
    collection.findOne({$text: {$search : mongoItemName}}, function(err, item) {
      //error finding item
      if (err) console.log(err);
      //if no current market entries
      if (item == null) {
        msg.channel.send("Couldn't find data for " + itemName.join(' ') + ".");
        return;
      }
      callback(item);
    });
  }
}

module.exports = {
  findItem (itemName, msg, db, callback) {

    //parse itemName for mongoDB search
    //should be in this format "\"raven\" \"soul\""
    var mongoItemName = "";
    itemName.forEach(function(itemBit) {
      mongoItemName += "\"" + itemBit + "\" ";
    });

    // Get the itemList collection
    var collection = db.collection('itemList');
    // Find the item
    collection.findOne({$text: {$search : mongoItemName}}, function(err, item) {
      if (err) console.log(err);
      if (item==null) {
        msg.channel.send("Couldn't find data for " + itemName);
        return;
      }
      callback(item);
    });
  }
}

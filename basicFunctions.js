module.exports = {
  //takes the price value from the JSON array and parses it
  priceParse(price) {
    strPrice = price.toString();
    return strPrice.substring(0, strPrice.length-4)+"<:bns_gold:345286922412752897>"
      +strPrice.substring(strPrice.length-4, strPrice.length-2)+"<:bns_silver:345286933494366208>"
      +strPrice.substring(strPrice.length-2, strPrice.length)+"<:bns_copper:345286894516568066>";
  }
}

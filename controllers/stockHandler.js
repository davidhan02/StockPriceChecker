const MongoClient       = require('mongodb'),
      request           = require('request'),
      CONNECTION_STRING = process.env.DB,
      key               = process.env.API_KEY;

function StockHandler() {
  
  this.getInfo = (stock, callback) => {
    var result;
    request(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${key}`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //set variables from API info
        let symbol = JSON.parse(body)['Global Quote']['01. symbol'];
        let price = JSON.parse(body)['Global Quote']['05. price'];
        //set var stockInfo to the stock info result
        callback('stockInfo', {stock: symbol ,price: price});
      } else {
        console.log('Error in API query');
        //set var stockInfo to error message
        callback('stockInfo', 'External Source Error');
      }
    });
  };
  
  //function to access DB to create likes list
  this.loadLikes = (stock, like, ip, callback) => {
    MongoClient.connect(CONNECTION_STRING, (err, db) => {
      
      let collection = db.collection('stock_likes');
      //if the like box isn't checked, just return the length of the likes
      if(!like) {
        //search by stock symbol
        collection.find({stock: stock})
        .toArray((err, doc) => {
          let likes = 0;
          if (doc.length > 0){
            likes = doc[0].likes.length;
            //console.log(doc[0]);
          }
          //assign result to variable likeCount
          callback('likeCount', {stock: stock, likes: likes});
        });
      } else {
        //if they like it, modify and return
        collection.findAndModify(
          {stock: stock},
          [],
          //create one if there isn't
          {$addToSet: { likes: ip }},
          {new: true, upsert: true},
          (err, doc) => {
            let likes = doc.value.likes.length;
            //assign result to variable likeCount
            callback('likeCount',{stock: stock, likes: likes});
          });
      }
    });
  };
}
//export this
module.exports = StockHandler;
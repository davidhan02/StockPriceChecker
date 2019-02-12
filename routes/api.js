/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect            = require('chai').expect,
      StockHandler      = require('../controllers/stockHandler.js'),
      CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  //create new instance of StockHandler
  const stockHandle = new StockHandler();

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock,
          like = req.query.like || false,
          reqIP = req.connection.remoteAddress,
          stockInfo = null,
          likeCount = null,
          multiple = false;
      //multiple stock inputs
      if (Array.isArray(stock)) {
        multiple = true;
        stockInfo = [];
        likeCount = [];
      }
      //define compare for multiple here
      const compare = (done, result) => {
        if (done == 'stockInfo') {
          (multiple) ? stockInfo.push(result) : stockInfo = result;
        } else {
          (multiple) ? likeCount.push(result) : likeCount = result;
        }
        //if there are multiple stocks w/info and likes
        if (!multiple && stockInfo && likeCount !== null) {
          stockInfo.likes = likeCount.likes;
          res.json({stockInfo});
        } else if (multiple && stockInfo.length == 2 && likeCount.length == 2) {
          if (stockInfo[0].stock == likeCount[0].stock) {
            //relative likes for comparison
            stockInfo[0].rel_likes = likeCount[0].likes - likeCount[1].likes;
            stockInfo[1].rel_likes = likeCount[1].likes - likeCount[0].likes;
          } else {
            stockInfo[0].rel_likes = likeCount[1].likes - likeCount[0].likes;
            stockInfo[1].rel_likes = likeCount[0].likes - likeCount[1].likes;
          }
          res.json({stockInfo});
        }
      }
      if (multiple) {
        stockHandle.getInfo(stock[0], compare);
        stockHandle.loadLikes(stock[0], like, reqIP, compare);
        stockHandle.getInfo(stock[1], compare);
        stockHandle.loadLikes(stock[1], like, reqIP, compare);
      } else {
        stockHandle.getInfo(stock, compare);
        stockHandle.loadLikes(stock, like, reqIP, compare);
      }
    });
};


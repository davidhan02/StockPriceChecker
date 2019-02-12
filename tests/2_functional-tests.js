/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http'),
      chai = require('chai'),
      assert = chai.assert,
      server = require('../server');

var likes,
    rel_likes;

chai.use(chaiHttp);

suite('Functional Tests', () => {
    
    suite('GET /api/stock-prices => stockData object', () => {
      
      test('1 stock', function(done) {
       chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockInfo.stock, "GOOG");
            assert.approximately(Number(res.body.stockInfo.price), 1000, 100); //Adjust here
            assert.approximately(res.body.stockInfo.likes, 0, 10); //Adjust here
            //complete this one too
            done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'aapl', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockInfo.stock, "AAPL");
            assert.approximately(Number(res.body.stockInfo.price), 160, 50); //Adjust here
            assert.approximately(res.body.stockInfo.likes, 0, 10); //Adjust here
            //set likes for next test
            likes = res.body.stockInfo.likes;
            done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'aapl', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockInfo.stock, "AAPL");
            assert.approximately(Number(res.body.stockInfo.price), 160, 50); //Adjust here
            assert.approximately(res.body.stockInfo.likes, 0, 10); //Adjust here
            done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('api/stock-prices')
          .query({stock: ['aapl', 'goog']})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockInfo[0].stock, "AAPL");
            assert.equal(res.body.stockInfo[1].stock, "GOOG");
            assert.approximately(Number(res.body.stockInfo[0].price), 160, 50); //Adjust here
            assert.approximately(Number(res.body.stockInfo[1].price), 1000, 100); //Adjust here
            assert.approximately(res.body.stockInfo[0].rel_likes, 0, 10); //Adjust here
            assert.approximately(res.body.stockInfo[1].rel_likes, 0, 10); //Adjust here
            done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('api/stock-prices')
          .query({stock: ['fb', 'snap'], like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockInfo[0].stock, "FB");
            assert.equal(res.body.stockInfo[1].stock, "SNAP");
            assert.approximately(Number(res.body.stockInfo[0].price), 140, 40); //Adjust here
            assert.approximately(Number(res.body.stockInfo[1].price), 6, 5); //Adjust here
            assert.approximately(res.body.stockInfo[0].rel_likes, 0, 10); //Adjust here
            assert.approximately(res.body.stockInfo[1].rel_likes, 0, 10); //Adjust here
            done();
        });
      });
      
    });

});

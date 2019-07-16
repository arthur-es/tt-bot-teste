console.log('The Twitter stock bot is starting...');
const twitter_config = require('./twitter_config');
const Twit = require('twit');
var T = new Twit(twitter_config);

let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo';
var request = require('request');

function tweetIt(toTweet){
    console.log('Tweeting the stock price...');
    let params = { status: toTweet };
    T.post('statuses/update', params, twitted);
    function twitted(err, data, response) {
        if(err) 
            console.log('Something went wrong!')
        else 
            console.log('It worked! The bot just tweeted "' + toTweet + '"');
    }
}

console.log('Getting the stock price...')
request(url, getStockInfoBody);

function getStockInfoBody(error, response, body) {
    let content = JSON.parse(body);
    let stockInfo = content['Time Series (5min)'];
    let lastUpdate = stockInfo[Object.keys(stockInfo)[0]];
    let open = lastUpdate[Object.keys(lastUpdate)[0]];
    let high = lastUpdate[Object.keys(lastUpdate)[1]];
    let low = lastUpdate[Object.keys(lastUpdate)[2]];
    let close = lastUpdate[Object.keys(lastUpdate)[3]];
    let volume = lastUpdate[Object.keys(lastUpdate)[4]];

    let tweet = `The MSFT stock price today: Opened at the price of ${ open }, and the highest price was ${ high } and the lowest price point was ${ low }. And finnaly, the closing price point was ${ close }.`;
    tweetIt(tweet);
}

setInterval(doTheWork, 60000);
//24hours = 6*600000*24 miliseconds

function doTheWork(){
    console.log('Getting the stock price...')
    request(url, getStockInfoBody);
}
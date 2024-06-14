import { TradeJournal } from "./tradeJournal.model";

// Include fs module
const fs = require("fs");

// const fileName = "Webull_Orders_Records_Options.csv";
const fileName = "webull_trade1.csv";

// convert trades string to Array of string
const trades = fs
  .readFileSync(fileName, {
    encoding: "utf-8",
  })
  .replace(/\r/g, "") // replace extra \r
  .split("\n")
  .map((row: string): string[] => {
    return row.split(",");
  });

// Headers
//   [
//     'Name',          'Symbol',
//     'Side',          'Status',
//     'Filled',        'Total Qty',
//     'Price',         'Avg Price',
//     'Time-in-Force', 'Placed Time',
//     'Filled Time\r'
//   ],

let tradeJournal = new TradeJournal(trades.slice(1).reverse(), "webull");
console.log("all trades", tradeJournal.trades.length, tradeJournal.trades);
console.log("buy trades", tradeJournal.webullTradeModel.getOrders("buy").length);
console.log("sell trades", tradeJournal.webullTradeModel.getOrders("sell").length);

tradeJournal.init();
console.log("buySellPairTrades trades", tradeJournal.buySellPairTrades.length, tradeJournal.buySellPairTrades);
// console.log("buy trades", tradeJournal.webullTradeModel.buyTrades);
// console.log("sell  trades", tradeJournal.webullTradeModel.sellTrades);
console.log("transformToCompletedTrade-----");

tradeJournal.transformToCompletedTrade();
console.log("custom trades --->", tradeJournal.trades);

// navigator.clipboard.writeText(tradeJournal.trades.toString());

// import copy from 'copy-to-clipboard';

// copy('Text');

// // Copy with options
// copy('Text', {
//   debug: true,
//   message: 'Press #{key} to copy',
// });

var ncp = require("copy-paste");

// Todo override toString method
ncp.copy(tradeJournal.trades.toString(), function () {
  // complete...
});

const ObjectsToCsv = require("objects-to-csv");
new ObjectsToCsv(tradeJournal.trades).toDisk("./result-trades.csv");

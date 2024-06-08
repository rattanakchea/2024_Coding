import { CustomTrade, TradeJournal, WebullTrade } from "./trade.model";

// Include fs module
const fs = require("fs");

const fileName = "Webull_Orders_Records_Options.csv";

// convert trades string to Array of string
const trades = fs
  .readFileSync(fileName, {
    encoding: "utf-8",
  })
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

// Map to array of {name: value, side: value, ...}
// console.log("trades: ", trades);

// console.log("sellOrders", sellOrders);

let tradeJournal = new TradeJournal(trades.slice(1));
tradeJournal.init();

console.log("trades", tradeJournal.trades);

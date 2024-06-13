import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

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
console.log("completeTrades trades", tradeJournal.buySellPairTrades.length, tradeJournal.buySellPairTrades);
console.log("buy trades", tradeJournal.webullTradeModel.buyTrades);
console.log("sell  trades", tradeJournal.webullTradeModel.sellTrades);

// ------- export to csv
// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
// const csvConfig = mkConfig({ useKeysAsHeaders: true });

// const csv = generateCsv(csvConfig)([]);
// const filename = `${csvConfig.filename}.csv`;
// const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

// // Write the csv file to disk
// writeFile(filename, csvBuffer, (err) => {
//   if (err) throw err;
//   console.log("file saved: ", filename);
// });

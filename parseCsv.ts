import { CustomTrade, WebullTrade } from "./trade.model";

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

for (let i = 1; i < trades.length; i++) {
  const wTrade = new WebullTrade(trades[i]);
  //   console.log("singleTrade", wTrade);
  if (!wTrade) continue;
  if (wTrade.status?.toLowerCase() !== "filled") continue;
  const customTrade = new CustomTrade(wTrade);
  console.log("customTrade", customTrade);
}

import { WebullTrade, WebullTradeModel } from "./WebullTrade.model";

class CustomTrade {
  name: string = "";
  symbol: string = ""; // SPY240606P00533000
  ticker: string = "";
  expirationDate: string = "";
  strike: string = "";
  entryDateTime?: string = "";
  exitDateTime?: string = "";
  qty: number | string = 0;
  entry: string = ""; // entry price
  exit: string = ""; // exit price

  constructor(wTrade: WebullTrade) {
    // validation, trade must be filled
    if (wTrade.status && wTrade.status.toLowerCase() !== "filled") {
      console.error("The trade was not filled.");
      return;
    }

    // construct only new Trade that is a buy order
    if (wTrade.side?.toLowerCase() === "sell") {
      console.error("The trade is a sell order. Cannot construct a new Trade");
      return;
    }

    // console.log("constructor WTrade: ", wTrade);
    // If it is a Sell Order (close the trade)
    // Dont construct a new Object, merge with the existing buy Trade
    const [ticker, expirationDate, time, timezone, side, strike] = wTrade.name.split(" ");
    this.name = wTrade.name;
    this.ticker = ticker;
    this.expirationDate = expirationDate;
    this.strike = strike + (side === "Call" ? "C" : "P");
    this.entryDateTime = wTrade.filledTime;
    this.qty = wTrade.filled || wTrade.totalQty;
    this.entry = wTrade.avgPrice; //entry price
    this.symbol = wTrade.symbol;
  }

  isTradeOpen(): boolean {
    return true;
  }

  isTradeComplete() {
    return this.entry && this.exit;
  }
}

export class TradeJournal {
  trades: CustomTrade[] = []; // can be a Hashmap?

  webullTradeModel: any;
  completeTrade: CustomTrade[] = []; // complete has buy-sell order

  constructor(tradesStringArray: string[][], broker: string) {
    if (broker === "webull") {
      this.webullTradeModel = new WebullTradeModel(tradesStringArray);
    }
  }

  init() {
    this.webullTradeModel.processTrade();
  }

  getCompletedTrades() {
    return this.webullTradeModel.completedTrades;
  }
}

// Testing ?

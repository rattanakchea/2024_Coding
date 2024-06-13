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

  constructor(buyOrder: WebullTrade, sellOrder: WebullTrade) {
    // validation, trade must be filled
    if (buyOrder.status && buyOrder.status.toLowerCase() !== "filled") {
      console.error("The trade was not filled.");
      return;
    }
    // buyOrder.filled equals sellOrder.filled
    if (buyOrder.filled !== sellOrder.filled) {
      console.error("The trade filled quantity does not match");
      return;
    }
    const [ticker, expirationDate, time, timezone, side, strike] = buyOrder.name.split(" ");
    this.name = buyOrder.name;
    this.ticker = ticker;
    this.expirationDate = expirationDate;
    this.strike = strike + (side === "Call" ? "C" : "P");
    this.entryDateTime = buyOrder.filledTime;
    this.qty = buyOrder.filled || buyOrder.totalQty;
    this.entry = buyOrder.avgPrice; //entry price
    this.symbol = buyOrder.symbol;

    const [s_ticker, s_expirationDate, s_time, s_timezone, s_side, s_strike] = sellOrder.name.split(" ");
    this.exit = sellOrder.avgPrice; //exit price
    this.exitDateTime = sellOrder.filledTime;
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
  private _buySellPairTrades: CustomTrade[] = []; // have buy-sell order

  constructor(tradesStringArray: string[][], broker: string) {
    if (broker === "webull") {
      this.webullTradeModel = new WebullTradeModel(tradesStringArray);
    }
  }

  init() {
    this._buySellPairTrades = this.webullTradeModel.processTrade();
  }

  set buySellPairTrades(trades) {
    this._buySellPairTrades = trades;
  }

  get buySellPairTrades() {
    return this._buySellPairTrades;
  }

  // transform to CustomTrades
  tranformToCompletedTrade() {
    for (let [buyOrder, sellOrder] of this.buySellPairTrades) {
      let customTrade = new CustomTrade(buyOrder, sellOrder);
      this.trades.push(customTrade);
    }
  }
}

// Testing ?

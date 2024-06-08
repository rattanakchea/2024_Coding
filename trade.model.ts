// transformed Trade
export interface ITrade {
  name: string;
  ticker: string;
  entryDateTime: Date;
  exitDateTime?: Date;
}

export class WebullTrade {
  name: string; // SPY 06/11/2024 00:00:00 EDT Call $537.00
  symbol: string;
  side: "Buy" | "Sell" | string;
  status: "Filled" | "Cancelled" | string;
  filled: string;
  totalQty: string;
  price: string;
  avgPrice: string;
  timeInForce: string;
  placedTime: string;
  filledTime: string;

  constructor(trades: string[]) {
    // deconstruct trades array
    // assign to Trade class members
    [this.name, this.symbol, this.side, this.status, this.filled, this.totalQty, this.price, this.avgPrice, this.timeInForce, this.placedTime, this.filledTime] = trades;
  }
}

export class CustomTrade {
  name: string = "";
  ticker: string = "";
  expirationDate: string = "";
  strike: string = "";
  entryDateTime?: string = "";
  exitDateTime?: string = "";
  qty: string = "";
  entry: string = ""; // entry price

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
    this.entry = wTrade.avgPrice;
  }

  isBuyOrder(): boolean {
    return true;
  }

  isSellOrder() {}
}

export class TradeJournal {
  buyOrders: WebullTrade[] = [];
  sellOrders: WebullTrade[] = [];
  trades: CustomTrade[] = []; // can be a Hashmap?

  constructor(wTrades: WebullTrade[]) {
    for (let wTrade of wTrades) {
      if (wTrade.side.toLowerCase() === "buy") this.buyOrders.push(wTrade);
      else if (wTrade.side.toLowerCase() === "sell") this.sellOrders.push(wTrade);
    }
  }

  init() {
    for (let buyOrder of this.buyOrders) {
      const openTrade = new CustomTrade(buyOrder);
      this.trades.push(openTrade);
    }
  }
}

// Testing ?

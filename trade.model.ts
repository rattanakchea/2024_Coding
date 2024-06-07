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

  constructor(wTrade: WebullTrade) {
    if (wTrade.status && wTrade.status.toLowerCase() !== "filled") {
      console.error("The trade was not filled.");
      return;
    }

    const [ticker, expirationDate, time, timezone, side, strike] = wTrade.name.split(" ");
    this.name = wTrade.name;
    this.ticker = ticker;
    this.expirationDate = expirationDate;
    this.strike = strike + (side === "Call" ? "C" : "P");
    if (wTrade.side?.toLowerCase() === "buy") {
      this.entryDateTime = wTrade.filledTime;
    } else if (wTrade.side?.toLowerCase() === "sell") {
      this.exitDateTime = wTrade.filledTime;
    }
  }
}

// Testing ?

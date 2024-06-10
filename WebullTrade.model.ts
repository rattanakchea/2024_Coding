export class WebullTrade {
  name: string; // SPY 06/11/2024 00:00:00 EDT Call $537.00
  symbol: string;
  side: "Buy" | "Sell" | string;
  status: "Filled" | "Cancelled" | string;
  filled: number;
  totalQty: number;
  price: string;
  avgPrice: string;
  timeInForce: string;
  placedTime: string;
  filledTime: string;

  constructor(trades: string[]) {
    // deconstruct trades array
    // assign to Trade class members
    let filled, totalQty;
    [this.name, this.symbol, this.side, this.status, filled, totalQty, this.price, this.avgPrice, this.timeInForce, this.placedTime, this.filledTime] = trades;

    this.filled = Number(filled);
    this.totalQty = Number(totalQty);
  }
}

export class WebullTradeModel {
  allTrades: WebullTrade[] = [];
  buyTrades: WebullTrade[] = []; // all opening trades
  sellTrades: WebullTrade[] = [];

  // a pair of [buyOrder, SellOrder] with same quantity and symbol
  completedTrades: WebullTrade[][] = [];

  constructor(tradesStringArray: string[][]) {
    for (let row of tradesStringArray) {
      const wTrade = new WebullTrade(row);
      if (!wTrade) continue;
      if (wTrade?.status?.toLowerCase() !== "filled") continue;
      this.allTrades.push(wTrade);
    }

    this.buyTrades = this.getOrders("buy"); // buy Orders
    this.sellTrades = this.getOrders("sell");
  }

  getOrders(orderSide: "buy" | "sell"): WebullTrade[] {
    return this.allTrades.filter((item) => item.side.toLowerCase() === orderSide);
  }

  // Not correct implementation
  processTradeOld(): WebullTrade[][] {
    // complete trade count
    for (let i = 0; i < this.sellTrades.length; i++) {
      const sellOrder = this.sellTrades[i];
      const buyTradeIndex = this.findMatchingOpenTradeIndex(sellOrder.symbol);
      const buyOrder = this.buyTrades[buyTradeIndex];
      if (buyOrder.filled == sellOrder.filled) {
        this.completedTrades.push([buyOrder, sellOrder]);
        // remove from openTrades
        this.buyTrades.splice(buyTradeIndex, 1);
        this.sellTrades.splice(i, 1);
      } else if (buyOrder.filled > sellOrder.filled) {
        buyOrder.filled = -sellOrder.filled;
        this.completedTrades.push([buyOrder, sellOrder]);
        this.sellTrades.splice(i, 1);
        // update buyOrder
        this.buyTrades[buyTradeIndex].filled = -sellOrder.filled;
      } else if (buyOrder.filled < sellOrder.filled) {
        sellOrder.filled = -buyOrder.filled;
        this.completedTrades.push([buyOrder, sellOrder]);
        this.buyTrades.splice(i, 1);
        // update sellOrder
        this.sellTrades[i].filled = -sellOrder.filled;
      }
    }
    return this.completedTrades;
  }

  processTrade(): WebullTrade[][] {
    // complete trade count
    let sellOrder: WebullTrade | undefined | null = null;
    while (this.sellTrades.length) {
      if (!sellOrder) {
        sellOrder = this.sellTrades.shift();
      }
      const buyTradeIndex = this.findMatchingOpenTradeIndex(sellOrder!.symbol);
      const buyOrder = this.buyTrades[buyTradeIndex];
      if (buyOrder.filled == sellOrder?.filled) {
        this.completedTrades.push([buyOrder, sellOrder]);
        // remove from buy trades
        this.buyTrades.splice(buyTradeIndex, 1);
        sellOrder = null;
      } else if (buyOrder.filled > sellOrder!.filled) {
        buyOrder.filled = -sellOrder!.filled;
        this.completedTrades.push([buyOrder, sellOrder!]);
        sellOrder = null;
      } else if (buyOrder.filled < sellOrder!.filled) {
        sellOrder!.filled = -buyOrder.filled;
        this.completedTrades.push([buyOrder, sellOrder!]);
        this.buyTrades.splice(buyTradeIndex, 1);
      }
    }
    return this.completedTrades;
  }

  // symbol: SPY240606P00533000
  findMatchingOpenTrade(symbol: string) {
    return this.buyTrades.find((item) => item.symbol == symbol);
  }

  findMatchingOpenTradeIndex(symbol: string) {
    return this.buyTrades.findIndex((item) => item.symbol == symbol);
  }
}

import { BASE_CURRENCY } from "./Engine";

export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: "buy" | "sell";
    userId: string;
}

export interface Fill {
    price: string;
    qty: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
}

export class Orderbook {
    private bids: Order[];
    private asks: Order[];
    private baseAsset: string;
    private quoteAsset: string = BASE_CURRENCY;
    private lastTradeId: number;
    private currentPrice: number;

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }

    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }

    getSnapshot() {
        return {
            baseAsset: this.baseAsset,
            bids: this.bids,
            asks: this.asks,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice
        };
    }

    addOrder(order: Order): {
        executedQty: number,
        fills: Fill[]
    } {
        if (order.side === "buy") {
            const result = this.matchBid(order);
            if (result.executedQty < order.quantity) {
                this.bids.push(order);
            }
            return result;
        } else {
            const result = this.matchAsk(order);
            if (result.executedQty < order.quantity) {
                this.asks.push(order);
            }
            return result;
        }
    }

    private matchBid(order: Order): { fills: Fill[], executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;

        for (let i = 0; i < this.asks.length && executedQty < order.quantity; i++) {
            const ask = this.asks[i];
            if (ask.price <= order.price) {
                const filledQty = Math.min(order.quantity - executedQty, ask.quantity - ask.filled);
                executedQty += filledQty;
                ask.filled += filledQty;
                fills.push({
                    price: ask.price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: ask.userId,
                    markerOrderId: ask.orderId
                });
            }
        }

        this.asks = this.asks.filter(ask => ask.filled < ask.quantity);
        return { fills, executedQty };
    }

    private matchAsk(order: Order): { fills: Fill[], executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;

        for (let i = 0; i < this.bids.length && executedQty < order.quantity; i++) {
            const bid = this.bids[i];
            if (bid.price >= order.price) {
                const filledQty = Math.min(order.quantity - executedQty, bid.quantity - bid.filled);
                executedQty += filledQty;
                bid.filled += filledQty;
                fills.push({
                    price: bid.price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: bid.userId,
                    markerOrderId: bid.orderId
                });
            }
        }

        this.bids = this.bids.filter(bid => bid.filled < bid.quantity);
        return { fills, executedQty };
    }

    getDepth() {
        const bidsObj: { [key: string]: number } = {};
        const asksObj: { [key: string]: number } = {};

        this.bids.forEach(order => {
            bidsObj[order.price] = (bidsObj[order.price] || 0) + order.quantity - order.filled;
        });

        this.asks.forEach(order => {
            asksObj[order.price] = (asksObj[order.price] || 0) + order.quantity - order.filled;
        });

        const bids = Object.entries(bidsObj).map(([price, qty]) => [price, qty.toString()]);
        const asks = Object.entries(asksObj).map(([price, qty]) => [price, qty.toString()]);

        return { bids, asks };
    }

    getOpenOrders(userId: string): Order[] {
        return [...this.bids, ...this.asks].filter(order => order.userId === userId);
    }

    cancelOrder(order: Order): string | undefined {
        if (order.side === "buy") {
            return this.cancelBid(order);
        } else {
            return this.cancelAsk(order);
        }
    }

    private cancelBid(order: Order): string | undefined {
        const index = this.bids.findIndex(x => x.orderId === order.orderId);
        if (index !== -1) {
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            return price;
        }
    }

    private cancelAsk(order: Order): string | undefined {
        const index = this.asks.findIndex(x => x.orderId === order.orderId);
        if (index !== -1) {
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            return price;
        }
    }
}

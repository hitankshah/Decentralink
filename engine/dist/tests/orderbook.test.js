"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Orderbook_1 = require("../trade/Orderbook");
(0, vitest_1.describe)("Simple orders", () => {
    (0, vitest_1.it)("Empty orderbook should not be filled", () => {
        const orderbook = new Orderbook_1.Orderbook("TATA", [], [], 0, 0);
        const order = {
            price: 1000,
            quantity: 1,
            orderId: "1",
            filled: 0,
            side: "buy",
            userId: "1"
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        (0, vitest_1.expect)(fills.length).toBe(0);
        (0, vitest_1.expect)(executedQty).toBe(0);
    });
    (0, vitest_1.it)("Can be partially filled", () => {
        const orderbook = new Orderbook_1.Orderbook("TATA", [{
                price: 1000,
                quantity: 1,
                orderId: "1",
                filled: 0,
                side: "buy",
                userId: "1"
            }], [], 0, 0);
        const order = {
            price: 1000,
            quantity: 2,
            orderId: "2",
            filled: 0,
            side: "sell",
            userId: "2"
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        (0, vitest_1.expect)(fills.length).toBe(1);
        (0, vitest_1.expect)(executedQty).toBe(1);
    });
    (0, vitest_1.it)("Can be partially filled", () => {
        const orderbook = new Orderbook_1.Orderbook("TATA", [{
                price: 999,
                quantity: 1,
                orderId: "1",
                filled: 0,
                side: "buy",
                userId: "1"
            }], [{
                price: 1001,
                quantity: 1,
                orderId: "2",
                filled: 0,
                side: "sell",
                userId: "2"
            }], 0, 0);
        const order = {
            price: 1001,
            quantity: 2,
            orderId: "3",
            filled: 0,
            side: "buy",
            userId: "3"
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        (0, vitest_1.expect)(fills.length).toBe(1);
        (0, vitest_1.expect)(executedQty).toBe(1);
        (0, vitest_1.expect)(orderbook.bids.length).toBe(2);
        (0, vitest_1.expect)(orderbook.asks.length).toBe(0);
    });
});
(0, vitest_1.describe)("Self trade prevention", () => {
    vitest_1.it.todo("User cant self trade", () => {
        const orderbook = new Orderbook_1.Orderbook("TATA", [{
                price: 999,
                quantity: 1,
                orderId: "1",
                filled: 0,
                side: "buy",
                userId: "1"
            }], [{
                price: 1001,
                quantity: 1,
                orderId: "2",
                filled: 0,
                side: "sell",
                userId: "2"
            }], 0, 0);
        const order = {
            price: 999,
            quantity: 2,
            orderId: "3",
            filled: 0,
            side: "sell",
            userId: "3"
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        (0, vitest_1.expect)(fills.length).toBe(0);
        (0, vitest_1.expect)(executedQty).toBe(0);
    });
});
(0, vitest_1.describe)("Precission errors are taken care of", () => {
    // This does succeed right now as well, but can be flaky based on how long the decimals are
    vitest_1.it.todo("Bid doesnt persist even with decimals", () => {
        const orderbook = new Orderbook_1.Orderbook("TATA", [{
                price: 999,
                quantity: 0.551123,
                orderId: "1",
                filled: 0,
                side: "buy",
                userId: "1"
            }], [{
                price: 1001,
                quantity: 0.551,
                orderId: "2",
                filled: 0,
                side: "sell",
                userId: "2"
            }], 0, 0);
        const order = {
            price: 999,
            quantity: 0.551123,
            orderId: "3",
            filled: 0,
            side: "sell",
            userId: "3"
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        (0, vitest_1.expect)(fills.length).toBe(1);
        (0, vitest_1.expect)(orderbook.bids.length).toBe(0);
        (0, vitest_1.expect)(orderbook.asks.length).toBe(1);
    });
});

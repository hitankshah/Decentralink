"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Engine_1 = require("../trade/Engine");
const fromApi_1 = require("../types/fromApi");
vitest_1.vi.mock("../RedisManager", () => ({
    RedisManager: {
        getInstance: () => ({
            publishMessage: vitest_1.vi.fn(),
            sendToApi: vitest_1.vi.fn(),
            pushMessage: vitest_1.vi.fn()
        })
    }
}));
(0, vitest_1.describe)("Engine", () => {
    //TODO: How to test the singleton class RedisManager directly?
    (0, vitest_1.it)("Publishes Trade updates", () => {
        const engine = new Engine_1.Engine();
        const publishSpy = vitest_1.vi.spyOn(engine, "publishWsTrades");
        engine.process({
            message: {
                type: fromApi_1.CREATE_ORDER,
                data: {
                    market: "TATA_INR",
                    price: "1000",
                    quantity: "1",
                    side: "buy",
                    userId: "1"
                }
            },
            clientId: "1"
        });
        engine.process({
            message: {
                type: fromApi_1.CREATE_ORDER,
                data: {
                    market: "TATA_INR",
                    price: "1001",
                    quantity: "1",
                    side: "sell",
                    userId: "2"
                }
            },
            clientId: "1"
        });
        (0, vitest_1.expect)(publishSpy).toHaveBeenCalledTimes(2);
    });
});

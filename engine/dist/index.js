"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const Engine_1 = require("./trade/Engine");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const engine = new Engine_1.Engine();
        const redisClient = (0, redis_1.createClient)();
        yield redisClient.connect();
        console.log("connected to redis");
        while (true) {
            const response = yield redisClient.rPop("messages");
            if (!response) {
            }
            else {
                engine.process(JSON.parse(response));
            }
        }
    });
}
main();

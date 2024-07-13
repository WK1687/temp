"use strict";
// src/ton-connect/storage.ts
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
exports.TonConnectStorage = void 0;
const storage = new Map(); // 临时存储实现。我们将稍后用 redis 替换它
class TonConnectStorage {
    constructor(chatId) {
        this.chatId = chatId;
    } // 我们需要为不同的用户拥有不同的存储
    getKey(key) {
        return this.chatId.toString() + key; // 我们将简单地为不同的用户使用不同的键前缀
    }
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            storage.delete(this.getKey(key));
        });
    }
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            storage.set(this.getKey(key), value);
        });
    }
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return storage.get(this.getKey(key)) || null;
        });
    }
}
exports.TonConnectStorage = TonConnectStorage;
//# sourceMappingURL=storage.js.map
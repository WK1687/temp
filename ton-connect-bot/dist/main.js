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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot_1 = require("./bot");
const wallets_1 = require("./ton-connect/wallets");
const sdk_1 = __importDefault(require("@tonconnect/sdk"));
const storage_1 = require("./ton-connect/storage");
const qrcode_1 = __importDefault(require("qrcode"));
const app = (0, express_1.default)();
// 设置静态文件目录为 'public'
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// 启动Express服务器
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
bot_1.bot.on('message', msg => {
    const chatId = msg.chat.id;
    bot_1.bot.sendMessage(chatId, 'Received your message');
});
bot_1.bot.onText(/\/connect/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const wallets = yield (0, wallets_1.getWallets)();
    const connector = new sdk_1.default({
        storage: new storage_1.TonConnectStorage(chatId),
        manifestUrl: process.env.MANIFEST_URL
    });
    connector.onStatusChange(wallet => {
        if (wallet) {
            bot_1.bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });
    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper');
    const link = connector.connect({
        bridgeUrl: tonkeeper.bridgeUrl,
        universalLink: tonkeeper.universalLink
    });
    const image = yield qrcode_1.default.toBuffer(link);
    yield bot_1.bot.sendPhoto(chatId, image);
}));
//# sourceMappingURL=main.js.map
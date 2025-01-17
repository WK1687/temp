import express from 'express';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './ton-connect/storage';
import QRCode from 'qrcode';

const app = express();

// 设置静态文件目录为 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 启动Express服务器
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

bot.on('message', msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Received your message');
});

bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = new TonConnect({
        storage: new TonConnectStorage(chatId),
        manifestUrl: process.env.MANIFEST_URL
    });

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

    const link = connector.connect({
        bridgeUrl: tonkeeper.bridgeUrl,
        universalLink: tonkeeper.universalLink
    });
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image);
});
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';

const storage = new Map<string, string>(); // 临时存储实现。我们将稍后用 redis 替换它

export class TonConnectStorage implements IStorage {
    constructor(private readonly chatId: number) {} // 我们需要为不同的用户拥有不同的存储

    private getKey(key: string): string {
        return this.chatId.toString() + key; // 我们将简单地为不同的用户使用不同的键前缀
    }

    async removeItem(key: string): Promise<void> {
        storage.delete(this.getKey(key));
    }

    async setItem(key: string, value: string): Promise<void> {
        storage.set(this.getKey(key), value);
    }

    async getItem(key: string): Promise<string | null> {
        return storage.get(this.getKey(key)) || null;
    }
}
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

interface HasId {
    id: string | number
}

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) { }

    async getValue<T>(key: string): Promise<T[]> {
        return this.cacheManager.get(key);
    }

    async setValue<T>(key: string, newValue: T) {
        await this.cacheManager.set(key, newValue);
    }

    async addValueToCache<T extends HasId>(key: string, newValue: T): Promise<void> {
        const existedCaches: T[] = await this.cacheManager.get(key);
        if (existedCaches && existedCaches.length) {
            const cacheValues = await  this.getValueById(key, newValue.id);
            if (cacheValues) {
                await this.removeValue(key, newValue)
            }
            existedCaches.push(newValue);
            await this.cacheManager.set(key, existedCaches);
        } else {
            await this.cacheManager.set(key, [newValue]);
        }
    }

    async getValueById<T extends HasId>(key: string, id: string | number): Promise<T | null> {
        const cacheValues: T[] = await this.getValue(key);
        
        if (cacheValues) {
            const filterValues = cacheValues.filter(value => value.id === id);
            return filterValues[0]
        }

        return null;
    }

    async removeValue<T>(key: string, value: T) {
        const cachedValues = await this.getValue(key);

        if (cachedValues) {
            const filteredValue = cachedValues.filter(cacheValue => cacheValue === value);
            await this.setValue(key, filteredValue);
        }
    }
}
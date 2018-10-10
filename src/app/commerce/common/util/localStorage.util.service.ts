/*******************************************************************************
 * localStorage.util.service.ts
 *
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

export class LocalStorageUtilService {
  private EXPIRATION_SUFFIX = 'STORAGEUTIL-EXPIREKEY';
  private EXPIRATION_DAY: number = 24 * 60 * 60 * 1000;
  private readonly storage: Storage;
  private readonly KEY_PREFIX = 'COMMERCE-';
  private readonly STORAGE_KEYS = this.KEY_PREFIX + 'KEYS';
  private readonly isEnabled: boolean;

  constructor() {
    /* istanbul ignore else */
    if (window.localStorage) {
      this.storage = window.localStorage;
    }
    this.isEnabled = this.isLocalStorageEnabled();
    this.invalidateAllIfExpired();
  }

  /**
   * Gets the item from localStorage.
   * @param {string} key
   * @returns {string | null}
   */
  get(key: string): string | null {
    if (this.isEnabled) {
      return this.storage.getItem(this.KEY_PREFIX + key);
    } else {
      return null;
    }
  }

  /**
   * Save the item to localStorage
   * @param {string} key
   * @param {string} value
   * @param {number} expiration duration in days
   */
  put(key: string, value: string, expiration: number) {
    if (!this.isEnabled) {
      return;
    }
    this.remove(key);
    const currentKey = this.KEY_PREFIX + key;
    this.storage.setItem(currentKey, value);
    const jsonKeys: string[] = this.getStorageKeys();
    jsonKeys.push(key);
    this.saveStorageKeys(jsonKeys);
    if (expiration) {
      this.storage.setItem(this.KEY_PREFIX + this.getExpirationKey(key), this.getExpireValue(expiration));
    }
  }

  /**
   * Remove the localStorage cache item with specific key
   * @param {string} key
   */
  remove(key: string) {
    if (!this.isEnabled) {
      return;
    }
    this.storage.removeItem(this.KEY_PREFIX + key);
    this.storage.removeItem(this.KEY_PREFIX + this.getExpirationKey(key));
    const storageKeys = this.getStorageKeys();
    const kIndex = storageKeys.indexOf(key);
    /* istanbul ignore else */
    if (kIndex > -1){
      storageKeys.splice(kIndex,1);
    }
    this.saveStorageKeys(storageKeys);
  }

  /**
   * get the key that stores the expiration days info
   * @param {string} key
   * @returns {string} the key for storing expiration days
   */
  getExpirationKey(key: string) {
    return `${key}-${this.EXPIRATION_SUFFIX}`;
  }

  /**
   * Invalidate the localStorage cache if it is expired.
   * @param {string} key
   */
  public invalidateIfExpired(key: string): boolean{
    const expireKey = this.getExpirationKey(key);
    const expireTime = this.get(expireKey);
    const currentTime = (new Date()).getTime();
    if (expireTime && currentTime > parseInt(expireTime, 10) ) {
      this.remove(key);
      return true;
    } else {
      return false;
    }
  }

  private isLocalStorageEnabled(): boolean {
    if (!this.storage) {
      return false;
    }
    const key = 'storageutil';
    const value = 'storageutil';
    this.storage.setItem(key, value);
    const testValue = this.storage.getItem(key);
    /* istanbul ignore else */
    if (testValue != null) {
      this.storage.removeItem(key);
      return true;
    } else {
      return false;
    }
  }

  private invalidateAllIfExpired() {
    const keys: string[] = this.getStorageKeys();
    const keysClone = [...keys];
    keys.forEach((k) => {
      if (this.invalidateIfExpired(k)) {
        keysClone.splice(keysClone.indexOf(k),1);
      }
    });
    this.saveStorageKeys(keysClone);
  }

  private getExpireValue(t: number) {
    return String((new Date()).getTime() + t * this.EXPIRATION_DAY);
  }

  private getStorageKeys(): string[] {
    const storageKeys = this.storage.getItem(this.STORAGE_KEYS);
    if (storageKeys === null) {
      return [];
    } else {
      return JSON.parse(storageKeys);
    }
  }

  private saveStorageKeys(keys: string[]) {
    this.storage.setItem(this.STORAGE_KEYS, JSON.stringify(keys));
  }

}

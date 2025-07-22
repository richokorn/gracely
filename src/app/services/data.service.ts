import { Injectable } from '@angular/core';
import { StoredData } from '../../types/stored-data.type';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getLocalStorageData(key: string): StoredData {
    const data: string | null = localStorage.getItem(key);
    if (data === null || data === undefined) return {} as StoredData;
    return { ...JSON.parse(data) };
  }

  setLocalStorageData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  removeLocalStorageData(key: string): void {
    localStorage.removeItem(key);
  }
}

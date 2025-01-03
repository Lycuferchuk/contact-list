import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Contact } from '../models/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private dataService: DataService) { }

  public setLocalStorageData(key: string, url: string): void {
    if (!localStorage.getItem(key)) {
      this.dataService.getData<Contact[]>(url).subscribe((data: Contact[]) => {

        this.setNewLocalStorageItem<Contact[]>(key, data); 
      });
    }
  }

  public getDataFromLocalStorage<T>(key: string): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  public setNewLocalStorageItem<T>(key: string, item: T) {
    localStorage.setItem(key, JSON.stringify(item));
  }
}

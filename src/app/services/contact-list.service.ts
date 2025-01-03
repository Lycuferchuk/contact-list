import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Contact } from '../models/contact.interface';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  private contactUrl: string = "/assets/data/contacts.json";
  private contactKey: string = "contacts";

  constructor(private localStorageService: LocalStorageService) { }

  public createContact(newContact: Contact) {
    this.getContacts().subscribe((data: Contact[]) => {
      const maxId = data.reduce((max, contact) => {
        const contactId = parseInt(contact.id, 10);
        return contactId > max ? contactId : max;
      }, 0);

      newContact.id = (maxId + 1).toString();
      data.push(newContact);
      this.localStorageService.setNewLocalStorageItem(this.contactKey, data);
    });
  }

  public editContact(updatedContact: Contact) {
    this.getContacts().subscribe((data: Contact[]) => {
      const index = data.findIndex(contact => contact.id == updatedContact.id)

      if (index !== -1) {
        data[index] = updatedContact;
        this.localStorageService.setNewLocalStorageItem(this.contactKey, data);
      }
    });
  }

  public deleteContact(id: string): void {
    this.getContacts().subscribe((data: Contact[]) => {
      const index = data.findIndex(contact => contact.id == id)

      if (index !== -1) {
        data.splice(index, 1);
        this.localStorageService.setNewLocalStorageItem(this.contactKey, data);
      }
    });
  }

  public getContactById(id: string): Observable<Contact> {
    return this.getContacts().pipe(
      map((data: Contact[]) => data.find(contact => contact.id == id) ?? {} as Contact)
    );
  }

  public getContacts(): Observable<Contact[]> {
    return of(this.localStorageService.getDataFromLocalStorage<Contact[]>(this.contactKey));
  }

  public setContacts(): void {
    this.localStorageService.setLocalStorageData(this.contactKey, this.contactUrl);
  }
}

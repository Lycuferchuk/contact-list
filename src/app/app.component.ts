import { Component } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { ContactListService } from './services/contact-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private contactService: ContactListService) {
  }

  ngOnInit() {
    this.contactService.setContacts();
  }
}

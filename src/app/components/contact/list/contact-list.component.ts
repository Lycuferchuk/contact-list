import { Component } from '@angular/core';
import { Contact } from '../../../models/contact.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactListService } from '../../../services/contact-list.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  public contacts: Contact[] = [];
  public filteredContacts: Contact[] = [];
  public filterForm!: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(private contactService: ContactListService,
              private route: Router) { }

  ngOnInit() {
    this.getContacts();
    this.initForm();
    this.initFilter();
  }
    
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onAdd(): void {
    this.route.navigate([`contacts/add`]);
  }

  public onContactDetail(id: string): void {
    this.route.navigate([`contacts/${id}/view`]);
  }

  private initFilter() {
    this.subscription.add(
      this.filterForm.get('name')?.valueChanges.subscribe(value => this.applyFilter(value))
    );
  }

  private applyFilter(searchText: string): void {
    const search = searchText.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(search) || 
      contact.lastName.toLowerCase().includes(search)
    );
  }

  private initForm(): void {
    this.filterForm = new FormGroup({
      name: new FormControl('')
    });
  }

  private getContacts(): void {
    this.subscription.add(
      this.contactService.getContacts().subscribe((data: Contact[]) => {
        this.contacts = data;
        this.filteredContacts = data;
      })
    );
  }
}

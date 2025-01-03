import { Component } from '@angular/core';
import { Contact } from '../../../../models/contact.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactListService } from '../../../../services/contact-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent {
  public contact: Contact = {} as Contact;
  public contactForm!: FormGroup;
  public isCreateMode: boolean = false;
  public isViewMode: boolean = false;
  public isEditMode: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private activateRoute: ActivatedRoute,
              private contactService: ContactListService,
              private route: Router) { }

  ngOnInit() {
    this.initForm();
    this.getUrlParams();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public save(): void {
    const contact = this.getFormData();

    if (contact.id == "0") {
      this.contactService.createContact(contact);
    } else {
      this.contactService.editContact(contact);
    }

    this.route.navigate([`contacts`]);
  }

  private setFormData():void {
    this.contactForm = new FormGroup({
      firstName: new FormControl(this.contact?.firstName ?? "", Validators.required),
      lastName: new FormControl(this.contact?.lastName ?? "", Validators.required),
      contactNumber: new FormControl(this.contact?.contactNumber ?? "", [Validators.required, Validators.pattern('^\\+[0-9]{10}$')]),
      email: new FormControl(this.contact?.email ?? "", [Validators.required, Validators.email]),
      birthDate: new FormControl(this.contact?.birthDate ?? "", Validators.required),
      street: new FormControl(this.contact?.street ?? "", Validators.required),
      city: new FormControl(this.contact?.city ?? "", Validators.required),
    });
  }

  private getFormData(): Contact {
    return {
      id: this.contact?.id ?? "0",
      firstName: this.contactForm.value.firstName,
      lastName: this.contactForm.value.lastName,
      contactNumber: this.contactForm.value.contactNumber,
      email: this.contactForm.value.email,
      birthDate: this.contactForm.value.birthDate,
      street: this.contactForm.value.street,
      city: this.contactForm.value.city
    } as Contact;
  }

  private initForm() {
    this.contactForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      contactNumber: new FormControl('', [Validators.required, Validators.pattern('^\\+[0-9]{10}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      birthDate: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
    });
  }

  private getUrlParams(): void {
    this.subscription.add(
      this.activateRoute.params.subscribe(params => {
        if (params["contactId"]) {
          this.getContact(params["contactId"]);
        }

        if (params["urlMode"]) {
          this.setMode(params["urlMode"]);
        }
      })
    )
  }

  private setMode(urlMode: string): void {
    switch (urlMode) {
      case "add":
        this.isCreateMode = true;
        break;
      case "edit":
        this.isEditMode = true;
        this.isViewMode = false;
        break;
      case "view":
        this.isViewMode = true;
        this.isEditMode = false;
        this.isCreateMode = false;
        break;
      default: break;
    }
  }

  private getContact(id: string): void {
    this.contactService.getContactById(id).subscribe(data => {
      this.contact = data;
      this.setFormData();
    });
  }
}

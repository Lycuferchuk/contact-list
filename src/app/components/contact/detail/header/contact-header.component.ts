import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactListService } from '../../../../services/contact-list.service';

@Component({
  selector: 'app-contact-header',
  templateUrl: './contact-header.component.html',
  styleUrl: './contact-header.component.scss'
})
export class ContactHeaderComponent {
  private contactId: string = "";
  private subscription: Subscription = new Subscription();
  public isCreateMode: boolean = false;
  public isViewMode: boolean = false;
  public isEditMode: boolean = false;

  constructor(private route: Router,
              private activateRoute: ActivatedRoute,
              private contactService: ContactListService) { }

  ngOnInit() {
    this.getUrlParams();
  }

  public onList() {
    this.route.navigate([`contacts`]);
  }
    
  public edit(): void {
    this.route.navigate([`contacts/${this.contactId}/edit`]);
  }

  public delete(): void {
    this.contactService.deleteContact(this.contactId);
    this.onList();
  }

  private getUrlParams() {
    this.subscription.add(
      this.activateRoute.params.subscribe(params => {
        if (params["contactId"]) {
          this.contactId = params["contactId"];
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
}

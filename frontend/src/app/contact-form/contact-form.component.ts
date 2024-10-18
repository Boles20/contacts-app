import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { NgForm } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  contact: any = {
    name: '',
    address: '',
    notes: '',
    phone: '',
  };
  isLoading = false;
  errorMessage: string = '';
  contactId: string | null = null;
  private routerSub!: Subscription;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.contactId = params.get('id');

      if (this.contactId) {
        this.contactService.lockContact(this.contactId).subscribe(() => {
          this.socket.emit('lockContact', this.contactId);
        });

        this.contactService.getContactById(this.contactId).subscribe(
          (contact) => {
            this.contact = contact;
          },
          (error) => {
            this.errorMessage = 'Error loading contact details.';
          }
        );
      }
    });
  }

  phonePattern = /^\+201[0-9]{9}$/;

  isPhoneInvalid(): boolean {
    return (
      this.contact.phone &&
      !this.phonePattern.test(this.contact.phone.toString())
    );
  }

  addOrUpdateContact(form: NgForm) {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.contactId) {
      // Update contact
      this.contactService.updateContact(this.contactId, this.contact).subscribe(
        () => {
          this.contactService.unlockContact(this.contactId!).subscribe(() => {
            this.socket.emit('unlockContact', this.contactId);
            this.router.navigate(['/contacts']);
          });
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error updating contact. Please try again.';
        }
      );
    } else {
      // Add new contact
      this.contactService.addContact(this.contact).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/contacts']);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error adding contact. Please try again.';
        }
      );

      this.routerSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.unlockContactIfNeeded();
        }
      });
    }
  }

  unlockContactIfNeeded() {
    if (this.contactId) {
      this.contactService.unlockContact(this.contactId).subscribe(() => {
        this.socket.emit('unlockContact', this.contactId);
      });
    }
  }

  ngOnDestroy() {
    this.unlockContactIfNeeded();
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}

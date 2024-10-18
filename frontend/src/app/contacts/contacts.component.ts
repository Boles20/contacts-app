import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  contacts: any[] = [];
  page = 1;
  limit = 5;
  totalPages = 1;
  pagesArray: number[] = [];

  constructor(
    private contactService: ContactService,
    private socket: Socket,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.socket.fromEvent('contactLocked').subscribe((contact: any) => {
      console.log('Contact locked event received:', contact);
      this.updateContactLockStatus(contact, true);
    });
    this.socket.fromEvent('contactUnlocked').subscribe((contact: any) => {
      console.log('Contact unlocked event received:', contact);
      this.updateContactLockStatus(contact, false);
    });
  }

  loadContacts() {
    this.contactService.getContacts(this.page, this.limit).subscribe((data) => {
      this.contacts = data.contacts;
      this.totalPages = Math.ceil(data.totalContacts / this.limit);
      this.pagesArray = Array(this.totalPages)
        .fill(0)
        .map((x, i) => i + 1);
    });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadContacts();
    }
  }

  updateContactLockStatus(contact: any, locked: boolean) {
    const index = this.contacts.findIndex((c) => c._id === contact.contactId);
    if (index !== -1) {
      this.contacts[index].locked = locked;
    }
  }

  deleteContact(id: string) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe(() => {
        this.loadContacts();
      });
    }
  }

  editContact(contact: any) {
    this.contactService.lockContact(contact._id).subscribe(() => {
      this.socket.emit('lockContact', contact._id);
      this.router.navigate(['/contact-form', contact._id]);
    });
  }

  addContact() {
    this.router.navigate(['/contact-form']);
  }

  logout() {
    this.authService.logout();
  }
}

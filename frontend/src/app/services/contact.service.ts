import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getContacts(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }

  getContactById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  addContact(contact: any): Observable<any> {
    return this.http.post(this.apiUrl, contact, {
      headers: this.getHeaders(),
    });
  }

  updateContact(id: string, contact: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, contact, {
      headers: this.getHeaders(),
    });
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  lockContact(id: string) {
    return this.http.put(
      `${this.apiUrl}/lock/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  unlockContact(id: string) {
    return this.http.put(
      `${this.apiUrl}/unlock/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
}

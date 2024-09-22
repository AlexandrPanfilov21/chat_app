import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUserById(userId: string | number) {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }
}

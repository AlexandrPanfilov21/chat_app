import { Injectable } from '@angular/core';
import {User} from "../../chat/interfaces/user.interface";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {Router} from "@angular/router";
import {UserProfileService} from "../../user-profile/services/user-profile.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User = {
    id: 1,
    username: 'Sasha',
    password: '123',
    is_online: true,
  }
  changeUser: Subject<void> = new Subject();

  private apiUrl = 'http://localhost:3000';

  constructor(
    private readonly userService: UserProfileService,

    private http: HttpClient,
    private readonly router: Router,
  ) {
    this.changeUser.subscribe(() => {
      if (localStorage.getItem('user')) {
        this.user = (JSON.parse(localStorage.getItem('user')) as unknown as User);
      }
    })
  }

  login(): Observable<any> {
    return this.userService.getUsers()
      .pipe(
        tap(() => {
          this.changeUser.next();
        })
      );
  }

  register(user): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user)
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}

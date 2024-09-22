import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";
import {User} from "../../../chat/interfaces/user.interface";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user: WritableSignal<Partial<User>> = signal({});

  constructor(
    private readonly auth: AuthService,
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user.set(this.auth.user);
  }
}

import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {UserProfileService} from "../../services/user-profile.service";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";
import {User} from "../../../chat/interfaces/user.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
    private readonly userService: UserProfileService,

    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user.set(this.auth.user);
  }
}

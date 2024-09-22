import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiButton} from "@taiga-ui/core";
import {User} from "../../../chat/interfaces/user.interface";
import {tap} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLogin: WritableSignal<boolean> = signal(false);
  showError: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly auth: AuthService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    const formData = this.loginForm.value;
    this.loginForm.markAsDirty();
    if (this.loginForm.valid) {
      this.auth.login()
        .pipe(
          tap((users: User[]) => {
            users.forEach(user => {
              if (user.username == formData.username && user.password == formData.password) {
                this.isLogin.set(true);
                this.auth.user = user;
                localStorage.setItem('user', JSON.stringify(user));
                this.router.navigate(['/']);
              } else {
                this.showError.set(true);
                this.isLogin.set(false);
              }
            })
          }),
        )
        .subscribe()
    }
  }
}

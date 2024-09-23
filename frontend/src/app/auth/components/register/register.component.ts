import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {NgIf} from "@angular/common";
import {TuiButton} from "@taiga-ui/core";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    TuiButton,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;

  destroy$: Subject<void> = new Subject();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly auth: AuthService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      is_online: [false],
    })
  }

  register() {
    const formData = this.registerForm.value;
    this.registerForm.markAsDirty();

    if (this.registerForm.valid) {
      this.auth.register(formData)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: () => this.router.navigate(['login'])
        });
    }
  }
}

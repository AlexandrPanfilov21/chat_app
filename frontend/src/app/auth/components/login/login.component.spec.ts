import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockAuthService {
  login() {
    return of([]);
  }
  user: any = null;
}

class MockActivatedRoute {
  params = of({});
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should not login if form is invalid', () => {
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.login();
    expect(component.isLogin()).toBeFalse();
  });

  it('should login successfully', () => {
    mockAuthService.login = () => of([{ username: 'validUser', password: 'validPass' }]);
    component.loginForm.controls['username'].setValue('validUser');
    component.loginForm.controls['password'].setValue('validPass');
    component.login();
    expect(component.isLogin()).toBeTrue();
  });
});

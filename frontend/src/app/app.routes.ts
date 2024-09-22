import { Routes } from '@angular/router';
import {MainComponent} from "./layout/main/main.component";
import {ChatLayoutComponent} from "./chat/components/chat-layout/chat-layout.component";
import {LoginComponent} from "./auth/components/login/login.component";
import {AuthGuard} from "./auth/guards/auth.guard";
import {RegisterComponent} from "./auth/components/register/register.component";
import {UserProfileComponent} from "./user-profile/components/user-profile/user-profile.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ChatLayoutComponent,
      },
      {
        path: 'user',
        component: UserProfileComponent,
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];

import { Routes } from '@angular/router';
import {MainComponent} from "./layout/main/main.component";
import {ChatLayoutComponent} from "./chat/components/chat-layout/chat-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ChatLayoutComponent,
      }
    ]
  }
];

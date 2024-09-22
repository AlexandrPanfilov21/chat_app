import { Component } from '@angular/core';
import {AuthService} from "../../auth/services/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    protected readonly auth: AuthService,
  ) { }
}

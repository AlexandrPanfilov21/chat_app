import { Component } from '@angular/core';
import {AuthService} from "../../auth/services/auth.service";
import {RouterLink} from "@angular/router";
import {TuiIcon} from "@taiga-ui/core";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TuiIcon
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    protected readonly auth: AuthService,
  ) { }
}

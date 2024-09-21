import { Component } from '@angular/core';
import {ChatComponent} from "../chat/chat.component";
import {ChannelsListComponent} from "../channels-list/channels-list.component";
import {AuthService} from "../../../auth/services/auth.service";
import {User} from "../../interfaces/user.interface";

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [
    ChatComponent,
    ChannelsListComponent
  ],
  templateUrl: './chat-layout.component.html',
  styleUrl: './chat-layout.component.scss'
})
export class ChatLayoutComponent {

  user: User;

  constructor(
    private readonly auth: AuthService,
  ) {
    this.user = {...this.auth.user};
  }
}

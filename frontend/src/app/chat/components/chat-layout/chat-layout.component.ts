import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatComponent} from "../chat/chat.component";
import {ChannelsListComponent} from "../channels-list/channels-list.component";
import {AuthService} from "../../../auth/services/auth.service";
import {User} from "../../interfaces/user.interface";
import {MyChannelsListComponent} from "../my-channels-list/my-channels-list.component";
import {UsersListComponent} from "../users-list/users-list.component";
import {WebSocketService} from "../../services/web-socket.service";

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [
    ChatComponent,
    ChannelsListComponent,
    MyChannelsListComponent,
    UsersListComponent
  ],
  templateUrl: './chat-layout.component.html',
  styleUrl: './chat-layout.component.scss'
})
export class ChatLayoutComponent implements OnInit, OnDestroy {

  user: User;

  constructor(
    private readonly auth: AuthService,
    private readonly webSocketService: WebSocketService,
  ) {
    this.user = {...this.auth.user};
  }

  ngOnInit() {
    this.webSocketService.updateUserStatus(this.user.id as string, true);

    // Обработчик для события закрытия вкладки
    window.addEventListener('beforeunload', () => {
      this.webSocketService.updateUserStatus(this.user.id as string, false);
    });
  }

  ngOnDestroy() {
    // Устанавливаем статус offline при уничтожении компонента
    this.webSocketService.updateUserStatus(this.user.id as string, false);
  }
}

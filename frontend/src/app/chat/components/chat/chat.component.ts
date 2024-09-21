import {ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {WebSocketService} from "../../services/web-socket.service";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {ChannelsListComponent} from "../channels-list/channels-list.component";
import {tap} from "rxjs";
import {Message} from "../../interfaces/message.interface";
import {User} from "../../interfaces/user.interface";
import {TuiAppearance, TuiButton, TuiScrollbar} from "@taiga-ui/core";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    ChannelsListComponent,
    TuiButton,
    TuiScrollbar
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChatComponent implements OnInit {

  @Input() user: User;

  messages: WritableSignal<Message[] | []>= signal([]);
  newMessage: string = '';

  constructor(
    private readonly chatService: ChatService,
    private readonly webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    console.log(this.user);
    this.chatService.getMessages('1')
      .pipe(
        tap(message => this.messages.set(message))
      ).subscribe();

    this.webSocketService.getMessages()
      .pipe(
        tap((message: Message) => this.messages.set([...this.messages(), message]))
      ).subscribe();
  }

  sendMessage() {
    const message = { from_user: this.user.id, channel_id: '1', content: this.newMessage };

    if (this.newMessage) {
      this.chatService.sendMessage(message).subscribe((messageResponse) => {
        this.webSocketService.sendMessage(messageResponse);
        this.newMessage = '';
      });
    }
  }
}

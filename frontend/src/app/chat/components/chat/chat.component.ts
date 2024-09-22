import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {WebSocketService} from "../../services/web-socket.service";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {ChannelsListComponent} from "../channels-list/channels-list.component";
import {concatMap, filter, forkJoin, map, switchMap, tap} from "rxjs";
import {Message} from "../../interfaces/message.interface";
import {User} from "../../interfaces/user.interface";
import {TuiAppearance, TuiButton, TuiScrollbar} from "@taiga-ui/core";
import {TuiInputInline} from "@taiga-ui/kit";
import {Channel} from "../../interfaces/channel.interface";
import {ActivatedRoute} from "@angular/router";
import {UserProfileService} from "../../../user-profile/services/user-profile.service";


const SOME_OFFSET_CONST = 20;

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    ChannelsListComponent,
    TuiButton,
    TuiScrollbar,
    TuiAppearance
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewInit {

  @Input() user: User;
  @ViewChild(TuiScrollbar, {read: ElementRef})
  private readonly scrollBar?: ElementRef<HTMLElement>;

  messages: WritableSignal<Partial<Message[]>> = signal([]);
  channel: WritableSignal<Partial<Channel>> = signal({});
  newMessage: string = '';

  constructor(
    private readonly userService: UserProfileService,
    private readonly chatService: ChatService,

    private readonly route: ActivatedRoute,
    private readonly webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['channelId'];
      this.chatService.getMessages(id)
        .pipe(
          filter(messages => {
            this.messages.set([]);
            return messages.length
          }),
          // Можно заранее получать список пользователей и фильтровать, используя js, во мзбежание большого количество запросов
          // Но потенциально нет смысла получать всех пользователей для этого, учитывая, что их может быть больше
          // В общем решил сделать так, но можно будет переделать
          concatMap((messages: Message[]) =>
            forkJoin(
              messages.map((message: Message) => {

                return this.userService.getUserById(message.from_user).pipe(
                  map((user: User) => ({...message, username: user.username})),
                  )
                }
              )
            )
          ),
          tap(message => this.messages.set(message))
        ).subscribe();

      this.getChannel(id);
    });

    this.webSocketService.getMessages()
      .pipe(
        concatMap((message: Message) =>
          forkJoin(
            this.userService.getUserById(message.from_user).pipe(
              map((user: User) => ({...message, username: user.username})),
              tap((message: Message) => this.messages.set([...this.messages(), message])),
              tap(() => this.scrollBottom()),
            )
          )
        ),
      ).subscribe();
  }

  ngAfterViewInit() {
    this.scrollBottom();
  }

  getChannel(id) {
    this.chatService.getChannelById(id)
      .pipe(
        tap((channel: Channel) => this.channel.set(channel))
      )
      .subscribe()
  }

  sendMessage() {
    const message = { from_user: this.user.id, channel_id: this.channel().id, content: this.newMessage };

    if (this.newMessage) {
      this.chatService.sendMessage(message).subscribe((messageResponse) => {
        this.webSocketService.sendMessage(messageResponse);
        this.newMessage = '';
        this.scrollBottom();
      });
    }
  }

  protected scrollBottom(): void {
    if (!this.scrollBar) {
      return;
    }

    const {nativeElement} = this.scrollBar;

    setTimeout(() => {
      nativeElement.scroll({top: nativeElement.scrollHeight})
    }, 200)
  }
}

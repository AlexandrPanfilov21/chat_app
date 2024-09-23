import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input, OnDestroy,
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
import {concatMap, forkJoin, map, Subject, takeUntil, tap} from "rxjs";
import {Message} from "../../interfaces/message.interface";
import {User} from "../../interfaces/user.interface";
import {TuiAppearance, TuiButton, TuiScrollbar} from "@taiga-ui/core";
import {Channel} from "../../interfaces/channel.interface";
import {ActivatedRoute} from "@angular/router";
import {UserProfileService} from "../../../user-profile/services/user-profile.service";
import {UserChannel} from "../../interfaces/user-channel.interface";


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
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() user: User;
  @ViewChild(TuiScrollbar, {read: ElementRef})
  private readonly scrollBar?: ElementRef<HTMLElement>;

  messages: WritableSignal<Partial<Message[]>> = signal([]);
  channel: WritableSignal<Partial<Channel>> = signal({});
  channelId: WritableSignal<string> = signal('');
  newMessage: string = '';

  destroy$: Subject<void> = new Subject();

  constructor(
    private readonly userService: UserProfileService,
    private readonly chatService: ChatService,

    private readonly route: ActivatedRoute,
    private readonly webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe(params => {
      this.channelId.set(params['channelId']);

      if (this.channelId()) {
        this.checkIsOwnChat();
      }
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
        takeUntil(this.destroy$),
      ).subscribe();
  }

  ngAfterViewInit() {
    this.scrollBottom();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkIsOwnChat() {
    this.chatService.getUserChannels(this.user)
      .pipe(
        tap((userChannel: UserChannel[]) => {
          const isOwn = userChannel.some((el: UserChannel) => el.channel_id == this.channelId());

          if (isOwn) {
            this.getMessages();
            this.getChannel();
          } else {
            this.channelId.set('')
          }
        }),
        takeUntil(this.destroy$),
      ).subscribe()
  }

  getMessages() {
    this.chatService.getMessages(this.channelId())
      .pipe(
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
        tap(message => this.messages.set(message)),
        takeUntil(this.destroy$),
      ).subscribe();
  }

  getChannel() {
    this.chatService.getChannelById(this.channelId())
      .pipe(
        tap((channel: Channel) => this.channel.set(channel)),
        takeUntil(this.destroy$),
      )
      .subscribe()
  }

  sendMessage() {
    const message = { from_user: this.user.id, channel_id: this.channel().id, content: this.newMessage };

    if (this.newMessage) {
      this.chatService.sendMessage(message)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe((messageResponse) => {
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

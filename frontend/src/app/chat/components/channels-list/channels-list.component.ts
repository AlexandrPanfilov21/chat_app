import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {WebSocketService} from "../../services/web-socket.service";
import {Channel} from "../../interfaces/channel.interface";
import {CommonModule} from "@angular/common";
import {tap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {TuiButton} from "@taiga-ui/core";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiButton,
  ],
  templateUrl: './channels-list.component.html',
  styleUrl: './channels-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsListComponent implements OnInit {

  @Output()
  joinChannel = new EventEmitter();

  channels: WritableSignal<Channel[] | []> = signal([]);
  input: string;

  constructor(
    private readonly router: Router,

    private readonly chatService: ChatService,
    private readonly auth: AuthService,
    private readonly webSocketService: WebSocketService,
  ) { }

  ngOnInit() {
    this.chatService.getChannels()
      .pipe(
        tap(channels => this.channels.set(channels)),
      ).subscribe()

    this.webSocketService.getChannel()
      .pipe(
        tap((channel: Channel) => this.channels.set([...this.channels(), channel])),
      ).subscribe();
  }

  createChat() {
    const channel = { name: this.input }
    this.chatService.createChannel(channel).subscribe((channelResponse) => {

      this.webSocketService.createChannel(channelResponse);
      this.input = '';
    });
  }

  joinToChannel(channel: Channel) {
    this.chatService.joinToChannel(this.auth.user, channel)
      .pipe(
        tap(() => this.joinChannel.emit())
      )
      .subscribe()
  }
}

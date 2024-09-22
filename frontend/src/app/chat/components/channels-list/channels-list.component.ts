import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {WebSocketService} from "../../services/web-socket.service";
import {Channel} from "../../interfaces/channel.interface";
import {CommonModule} from "@angular/common";
import {tap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './channels-list.component.html',
  styleUrl: './channels-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsListComponent implements OnInit {

  channels: WritableSignal<Channel[] | []> = signal([]);
  input: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly chatService: ChatService,
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

  changeChannel(id) {
    this.router.navigate([], {
      queryParams: {
        channelId: id,
      }
    });
  }
}

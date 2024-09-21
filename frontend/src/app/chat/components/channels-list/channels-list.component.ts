import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {WebSocketService} from "../../services/web-socket.service";
import {Channel} from "../../interfaces/channel.interface";
import {CommonModule} from "@angular/common";
import {tap} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-channels-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './channels-list.component.html',
  styleUrl: './channels-list.component.scss'
})
export class ChannelsListComponent implements OnInit {

  public channels: WritableSignal<Channel[] | []> = signal([]);
  input: string;

  constructor(
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
}

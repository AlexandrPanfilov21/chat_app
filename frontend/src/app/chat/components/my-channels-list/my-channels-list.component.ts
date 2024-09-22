import {ChangeDetectionStrategy, Component, Inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {forkJoin, map, switchMap, tap} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {UserChannel} from "../../interfaces/user-channel.interface";
import {Channel} from "../../interfaces/channel.interface";
import {NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TuiButton, TuiDialog, TuiDialogs, TuiDialogService} from "@taiga-ui/core";
import {ChannelsListComponent} from "../channels-list/channels-list.component";

@Component({
  selector: 'app-my-channels-list',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TuiButton,
    NgIf,
    ChannelsListComponent,
  ],
  templateUrl: './my-channels-list.component.html',
  styleUrl: './my-channels-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyChannelsListComponent implements OnInit {

  myChannels: WritableSignal<Channel[]> = signal([]);
  openModalChannels: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly chatService: ChatService,

    private readonly auth: AuthService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.getMyChannels();
  }

  getMyChannels() {
    forkJoin({
      userChannels: this.chatService.getUserChannels(this.auth.user),
      allChannels: this.chatService.getChannels(),
    }).pipe(
      map(({ userChannels, allChannels }: { userChannels: UserChannel[], allChannels: Channel[] }) => {
        return userChannels.map((userChannel: UserChannel) => {
          return allChannels.find((channel: Channel) => channel.id === userChannel.channel_id);
        });
      }),
      tap(myChannels => this.myChannels.set(myChannels))
    ).subscribe();
  }

  changeChannel(id) {
    this.router.navigate([], {
      queryParams: {
        channelId: id,
      }
    });
  }

  addChannel(): void {
    this.openModalChannels.set(true);
  }

  closeModal(): void {
    this.openModalChannels.set(false);
  }
}

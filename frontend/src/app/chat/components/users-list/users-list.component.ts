import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {User} from "../../interfaces/user.interface";
import {UserProfileService} from "../../../user-profile/services/user-profile.service";
import {Subject, takeUntil, tap} from "rxjs";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {TuiButton} from "@taiga-ui/core";
import {WebSocketService} from "../../services/web-socket.service";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgForOf,
    TuiButton,
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: WritableSignal<User[]> = signal([]);

  destroy$: Subject<void> = new Subject();

  constructor(
    private readonly userService: UserProfileService,
    private readonly webSocketService: WebSocketService,
    private readonly auth: AuthService,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.listenForStatusChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsers() {
    this.userService.getUsers()
      .pipe(
        tap((users: User[])  => this.users.set(users.filter(user => user.id != this.auth.user.id))),
        takeUntil(this.destroy$),
      ).subscribe()
  }

  listenForStatusChanges() {
    this.webSocketService.getUserStatusChanges()
      .pipe(
        tap(({ user_id, status }) => {
          const updateUsers = this.users().map(user => {
            if (user.id == user_id) {
              user.is_online = status;
            }

            return user;
          });

          this.users.set(updateUsers);
        }),
        takeUntil(this.destroy$),
      ).subscribe();
  }
}

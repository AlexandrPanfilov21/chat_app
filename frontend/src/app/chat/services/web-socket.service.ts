import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import {filter, Observable} from 'rxjs';
import {Message} from "../interfaces/message.interface";
import {Channel} from "../interfaces/channel.interface";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = new WebSocketSubject('/ws');
  }

  sendMessage(msg: Message) {
    const messagePayload = {
      type: 'message',
      ...msg
    };
    this.socket$.next(messagePayload);
  }

  // Метод для получения сообщений через WebSocket
  getMessages(): Observable<Message> {
    return this.socket$.pipe(
      filter(message => message.type === 'message') // Фильтруем только сообщения чата
    );
  }

  // Метод для создания нового канала
  createChannel(channel: Channel) {
    const channelPayload = {
      type: 'channel_created',
      ...channel
    };
    this.socket$.next(channelPayload);
  }

  // Метод для получения событий создания канала
  getChannel(): Observable<Channel> {
    return this.socket$.pipe(
      filter(message => message.type === 'channel_created') // Фильтруем только события создания канала
    );
  }

  updateUserStatus(userId: string, status: boolean) {
    const statusPayload = {
      type: 'status_change',
      user_id: userId,
      status: status
    };
    this.socket$.next(statusPayload);
  }

  // Получение обновлений статуса через WebSocket
  getUserStatusChanges(): Observable<{ user_id: string, status: boolean }> {
    return this.socket$.pipe(
      filter(message => message.type === 'status_change')
    );
  }
}

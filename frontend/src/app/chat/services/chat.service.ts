import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Message} from "../interfaces/message.interface";
import {User} from "../interfaces/user.interface";
import {Channel} from "../interfaces/channel.interface";
import {UserChannel} from "../interfaces/user-channel.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  getMessages(channelId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages?channel_id=${channelId}`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, message);
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`);
  }

  getChannelById(channelId: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.apiUrl}/channels/${channelId}`);
  }

  createChannel(channel): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/channels`, channel);
  }

  getUserChannels(user: User): Observable<UserChannel[]> {
    return this.http.get<UserChannel[]>(`${this.apiUrl}/user_channels?user_id=${user.id}`);
  }

  joinToChannel(user: User, channel: Channel): Observable<UserChannel> {
    return this.http.post<UserChannel>(`${this.apiUrl}/user_channels`, {user_id: user.id, channel_id: channel.id});
  }
}

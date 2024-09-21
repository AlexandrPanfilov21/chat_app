import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Message} from "../interfaces/message.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  getMessages(channelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages?channel_id=${channelId}`);
  }

  sendMessage(message: Message): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }

  getChannels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/channels`);
  }

  createChannel(channel): Observable<any> {
    return this.http.post(`${this.apiUrl}/channels`, channel);
  }
}

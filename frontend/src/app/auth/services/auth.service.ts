import { Injectable } from '@angular/core';
import {User} from "../../chat/interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User = {
    id: 1,
    username: 'Sasha',
    password: '123',
    is_online: true,
  }

  constructor() { }
}

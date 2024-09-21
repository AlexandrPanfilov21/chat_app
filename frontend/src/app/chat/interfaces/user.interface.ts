// Интерфейс для пользователей (users)
export interface User {
  id: string | number;
  username: string;
  password: string;
  is_online: boolean;
}

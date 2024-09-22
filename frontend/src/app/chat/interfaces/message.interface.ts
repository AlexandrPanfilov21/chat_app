// Интерфейс для сообщений (messages)
export interface Message {
  id?: string;
  from_user: string | number;  // ID пользователя, который отправил сообщение
  channel_id: string; // ID канала, в который было отправлено сообщение
  content: string;    // Содержание сообщения
  type?: string;
  username?: string;
}

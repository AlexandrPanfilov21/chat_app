// Интерфейс для связи пользователей с каналами (user_channels)
export interface UserChannel {
  user_id: string;    // ID пользователя
  channel_id: string; // ID канала
  id: string;         // Уникальный идентификатор записи
}

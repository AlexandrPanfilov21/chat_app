# chat_app


## Запуск проекта

## Требуемые пакеты

* json-server
```
npm install -g json-server
```
* Node.js
```
^18.19.1 || ^20.11.1 || ^22.0.0
```
* TypeScript 
```
>=5.4.0 <5.6.0
```
* RxJS
```
^6.5.3 || ^7.4.0
```

### Запуск backend
#### Для запуска бэкенда требуется перейти в папку \backend и запсукать команды в отдельных терминалах или через package.json
* Запуск json-server
```
json-server --watch db.json --port 3000
```
* Запуск WebSocket
```
node server.js
```

### Запуск frontend
#### Для запуска фронта требуется перейти в папку \front и запсукать команды в отдельных терминалах или через package.json
* Запуск проекта
```
ng serve
```
* Сборка проекта
```
ng build
```
* Запуск тестов
```
ng test
```
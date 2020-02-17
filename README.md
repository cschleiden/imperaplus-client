# ImperaPlus Client

## Getting started

1. npm install

2. npm run dev

3. Open http://localhost:8080 in a browser

## Client Generation

### REST 

REST clients are generated using NSwagStudio, settings file is in the imperaplus-backend repoistory. Note: the `token` endpoint generation doesn't work correctly, so after generation undo the change in the generated file. 

### SignalR

SignalR clients (chat, game chat, notifications) are hand-rolled for now, same for the DTOs.
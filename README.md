# ImperaPlus Client

![Build](https://github.com/cschleiden/imperaplus-client/workflows/Build/badge.svg)

## Getting started

1. npm install

2. npm run dev

3. Open http://localhost:8080 in a browser

## Client Generation

### REST 

REST clients are generated using NSwagStudio, settings file is in the imperaplus-backend repoistory. Note: the `token` endpoint generation doesn't work correctly, so after generation undo the change in the generated file. 

### SignalR

SignalR clients (chat, game chat, notifications) are hand-rolled for now, same for the DTOs.

## Contributing

Once a PR is merged, every change is auto-deployed to https://dev.imperaonline.de. Once everything looks good, changes need to be merged into the `production` branch for them to be deployed to prod.

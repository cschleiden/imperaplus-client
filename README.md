# ImperaPlus Client

![Build](https://github.com/cschleiden/imperaplus-client/workflows/Build/badge.svg)

## Getting started

1. npm install

2. npm run dev

3. Open http://localhost:8080 in a browser

**Note**: This will run the frontend only. By default, it connects to the production backend. For local end-to-end testing with a local backend instance, see [E2E_SETUP.md](./docs/E2E_SETUP.md).

## Client Generation

### REST 

REST clients are generated using NSwagStudio, settings file is in the imperaplus-backend repoistory. Note: the `token` endpoint generation doesn't work correctly, so after generation undo the change in the generated file. 

### SignalR

SignalR clients (chat, game chat, notifications) are hand-rolled for now, same for the DTOs.

## Local E2E Testing Setup

For instructions on setting up a complete local development environment including the backend for end-to-end testing, see [E2E_SETUP.md](./docs/E2E_SETUP.md).

The guide covers:
- Setting up the backend (imperaplus-backend)
- Configuring the frontend to use a local backend
- Running both services together
- Docker-based setup options
- Troubleshooting common issues

## Contributing

Once a PR is merged, every change is auto-deployed to https://dev.imperaonline.de. Once everything looks good, changes need to be merged into the `production` branch for them to be deployed to prod.

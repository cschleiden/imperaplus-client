# ImperaPlus Client — Agent Guide

## Project Overview

ImperaPlus Client is a **Next.js 12** web application for the ImperaOnline strategy game. It is written in **TypeScript** and uses **Redux Toolkit** for state management, **React Bootstrap** for UI, and **SignalR** for real-time communication (chat, notifications).

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 12, React 17 |
| Language | TypeScript 4.4 |
| State Management | Redux Toolkit 1.9, React Redux 7.2 |
| UI | React Bootstrap 0.33, Bootstrap SASS 3.4, Font Awesome 4.7 |
| Real-time | SignalR 3.1 |
| Visualization | D3 4.13 |
| i18n | i18next, custom `__()` helper |
| API Clients | Auto-generated via NSwag |

### Running the Project

```bash
npm install
npm run dev     # Starts dev server on port 8080
npm run build   # Production build
```

---

## Directory Structure

```
src/
├── pages/                  # Next.js pages (routing)
├── components/             # React components
│   ├── chat/               # Chat UI (Redux-connected class component)
│   ├── layout/             # Grid primitives (GridContainer, GridRow, GridColumn)
│   ├── layouts/            # Page layout wrappers (main, public, game, play)
│   ├── navigation/         # Nav bars (game, public) — Redux-connected
│   ├── play/               # Game play UI (map, header, sidebar, stats)
│   ├── tournaments/        # Tournament display
│   ├── messages/           # Message display
│   ├── misc/               # Utility components
│   └── ui/                 # Reusable primitives (buttons, timers, spinners)
├── lib/
│   ├── domain/             # Redux slices (state management)
│   │   ├── game/           # Game-domain slices
│   │   │   └── play/       # Active game-play slice (complex, multi-file)
│   │   └── shared/         # Cross-cutting slices (session, chat, forms, general, message)
│   └── utils/              # Helpers (hooks, DI container, game utils, etc.)
├── external/               # Auto-generated API client classes (NSwag)
├── clients/                # HTTP and SignalR client factories
├── services/               # Singletons (auth, events, notifications)
├── i18n/                   # Translation helpers and error codes
├── store.ts                # Redux store creation (SSR-aware)
├── reducers.ts             # Root reducer (combineReducers)
├── types.ts                # Global types (UserPayloadAction, AppThunk helpers)
├── configuration.ts        # Runtime config (base URIs, cookie settings)
└── styles/                 # Global SCSS
```

---

## Redux Architecture

### Store (`src/store.ts`)

The store is created via Redux Toolkit's `configureStore`. It is SSR-aware: a new store is created per server request, while the client reuses a singleton.

**Key details:**

- **Thunk extra argument** — every async thunk receives `{ createClient, getSignalRClient }` so API clients are injected, not imported directly.
- **Middleware** — default RTK middleware + `react-redux-loading-bar` for progress indicators.
- **Exported types** — `RootState`, `AppDispatch`, `AppThunk`, `AppThunkArg` provide full TypeScript coverage.

### Root Reducer (`src/reducers.ts`)

```
combineReducers({
  // Game domain
  news, games, ladders, alliances, tournaments, messages, play, mapPreview, chat,
  // Shared domain
  session, forms, message, general,
  // Third-party
  loadingBar
})
```

### Slice Pattern

Each domain area follows a consistent file structure:

```
src/lib/domain/game/alliances.slice.ts      — slice + async thunks
src/lib/domain/game/games.slice.ts          — slice + async thunks
src/lib/domain/game/games.actions.ts        — additional action creators
src/lib/domain/shared/session/
    session.slice.ts                        — slice + async thunks
    session.actions.ts                      — custom thunks (doLogin, doRestoreSession)
    session.selectors.ts                    — selectors (getToken, isLoggedIn, getUserId)
```

**Complex domains** split further. The play slice is the most elaborate:

```
src/lib/domain/game/play/
    play.slice.ts           — main slice definition + async thunks
    play.slice.state.ts     — initial state type and value
    play.slice.handlers.ts  — extraReducers handlers (complex game logic)
    play.selectors.ts       — selectors (canPlace, canMoveOrAttack, inputActive)
    play.actions.ts         — custom AsyncAction creators
```

#### Async Thunk Typing

All thunks use a three-parameter generic:

```typescript
export const fetch = createAsyncThunk<
    GameSummary[],        // Return type
    void,                 // Argument type
    AppThunkArg           // Thunk config (gives typed dispatch, getState, extra)
>("games/fetch", async (_, thunkAPI) => {
    const client = thunkAPI.extra.createClient(GameClient);
    const games = await client.getMy();
    thunkAPI.dispatch(refreshNotifications());
    return games;
});
```

#### Selectors

Selectors are plain functions that accept a state slice or `IState`:

```typescript
// src/lib/domain/shared/session/session.selectors.ts
export const getToken = (state: IState): string => state.session.access_token;
export const isLoggedIn = (state: IState): boolean => !!state.session.access_token;
export const getUserId = (state: IState): string => state.session.userInfo?.userId;
```

#### State Normalization

Some slices store entities as maps for O(1) lookups:

```typescript
// games.slice.ts state
{ games: { [gameId: number]: GameSummary }, openGames: GameSummary[] }
```

---

## Page Architecture

All pages live under `src/pages/` and follow the Next.js file-based routing convention.

### Page Hierarchy

```
src/pages/
├── _app.tsx                    # App wrapper — Redux Provider, session restore, layout selection
├── _document.tsx               # HTML document shell
├── index.tsx                   # Public landing page
├── login.tsx, signup.tsx       # Auth pages
├── activate/[userId].tsx       # Account activation
├── reset/[userId].tsx          # Password reset
├── game/                       # Authenticated game routes
│   ├── index.tsx               # Game dashboard (news, tournaments)
│   ├── games.tsx               # My Games list
│   ├── profile.tsx             # User profile
│   ├── games/create.tsx        # Create game
│   ├── games/join.tsx          # Join game
│   ├── play/[...gameId].tsx    # Active game play (most complex page)
│   ├── alliances/              # Alliance CRUD
│   ├── tournaments/            # Tournament browsing and management
│   ├── messages/               # In-game messaging
│   ├── ladders/                # Ranking ladders
│   └── mappreview/             # Map preview
└── (static pages: tos, privacy, imprint, etc.)
```

### `_app.tsx` — Application Shell

This is the entry point that wires everything together:

1. **Redux Provider** — wraps the entire component tree with the store.
2. **Session Restoration** — on first load, validates JWT from cookies via `doRestoreSession`.
3. **Layout Selection** — picks between `GameLayout` (authenticated) and `PublicLayout` based on login state and `page.needsLogin`.
4. **Route Change Hooks** — clears flash messages and navigation state on route transitions.

### Standard Page Pattern

Every page follows this contract:

```typescript
import { AppNextPage } from "../../components/layouts/app";

const MyPage: AppNextPage = () => {
    // 1. Select state from Redux
    const { data, userId } = useAppSelector(selector);

    // 2. Get dispatch function
    const dispatch = useDispatch<AppDispatch>();

    // 3. Render UI using state, dispatch actions from event handlers
    return <GridContainer>{/* ... */}</GridContainer>;
};

// 4. SSR data fetching — dispatches thunks before render
MyPage.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(fetchData());
    return {};
};

// 5. Page metadata
MyPage.needsLogin = true;
MyPage.getTitle = () => __("Page Title");

export default MyPage;
```

#### Step-by-step breakdown

| Step | Mechanism | Purpose |
|---|---|---|
| State selection | `useAppSelector(selector)` or `useSelector` | Read from Redux store with a selector function |
| Action dispatch | `useDispatch<AppDispatch>()` | Get a typed dispatch function |
| SSR data loading | `getInitialProps` | Dispatch async thunks on the server before the page renders |
| Auth gating | `needsLogin = true` | `_app.tsx` redirects to login if the user is unauthenticated |
| Page title | `getTitle` | Used by layout components to set `<title>` |

#### Selector Functions

Pages define a local selector at the top of the file:

```typescript
function selector(state: IState) {
    return {
        alliance: state.alliances.alliance,
        requests: state.alliances.requests,
        isAdmin: state.alliances.alliance?.admins
            ?.some(a => a.id === state.session.userInfo?.userId),
    };
}
```

### Game Play Page (`src/pages/game/play/[...gameId].tsx`)

This is the most complex page. It:

- Restores or loads a full game state via `doSwitchGame`.
- Sets up SignalR real-time notifications via `initNotifications`.
- Connects to the `play` Redux slice which manages all game-play logic (placing, attacking, moving).
- Renders the game map (`MapContainer`), header controls, sidebar, chat, and history.

---

## Component Patterns

### Redux Connection — Two Coexisting Styles

The codebase is in transition between two Redux connection patterns:

#### 1. Modern Hooks (preferred for new code)

```typescript
// src/components/play/sidebar.tsx
const Sidebar: React.FC = () => {
    const { game, otherGames } = useAppSelector((s) => ({
        game: s.play.game,
        otherGames: s.play.otherGames,
    }));
    // ...
};
```

#### 2. Legacy `connect()` HOC (older components)

```typescript
// src/components/play/header.tsx
export default connect(
    (state: IState) => ({
        game: game(state.play),
        inputActive: inputActive(state.play, getUserId(state)),
    }),
    (dispatch: AppDispatch) => ({
        place: () => dispatch(place()),
        attack: () => dispatch(attack()),
    })
)(Header);
```

Components using hooks: `sidebar.tsx`, `gameStats.tsx`, layout wrappers, most page components.
Components using `connect()`: `header.tsx`, `map.tsx`, `chat.tsx`, `gameChat.tsx`, `gameHistory.tsx`.

### Form System

Forms are managed through a Redux-backed `Form` component and `ControlledTextField` inputs:

```tsx
<Form
    name="alliance-create"
    onSubmit={async (formState, dispatch) => {
        await dispatch(create({ name: formState.getFieldValue("name") }));
    }}
    component={({ isPending, formState }) => (
        <>
            <ControlledTextField
                label={__("Name")}
                fieldName="name"
                required={true}
            />
            <ProgressButton isActive={isPending}>{__("Create")}</ProgressButton>
        </>
    )}
/>
```

The form slice (`src/lib/domain/shared/forms/forms.slice.ts`) tracks field values, pending state, and handles submission via a `doSubmit` thunk.

### Layout Components

Layout selection is driven by `_app.tsx`:

| Layout | Used For | File |
|---|---|---|
| `PublicLayout` | Landing, login, signup, static pages | `src/components/layouts/public.tsx` |
| `GameLayout` | All authenticated `/game/*` routes | `src/components/layouts/game.tsx` |
| `PlayLayout` | Active game play view | `src/components/layouts/play.tsx` |
| `MainLayout` | Shared wrapper (messages, language) | `src/components/layouts/main.tsx` |

---

## Services & Clients

### Client Factories (`src/clients/`)

- **`clientFactory.ts`** — Creates typed HTTP clients. Injects the JWT `Authorization` header and handles 401 token refresh automatically.
- **`signalrFactory.ts`** — Creates and caches SignalR hub connections for real-time game events.

Both are injected into Redux thunks via the store's `extraArgument`.

### Services (`src/services/`)

| Service | Purpose |
|---|---|
| `authProvider.ts` | Manages 401 callbacks for transparent token refresh |
| `eventService.ts` | Simple event bus (attach/detach/fire pattern) |
| `notificationService.ts` | SignalR notification handler — processes game events, chat, and other real-time messages |

### External API Clients (`src/external/`)

Auto-generated TypeScript classes from the backend OpenAPI spec using **NSwag**:

`AccountClient`, `GameClient`, `PlayClient`, `AllianceClient`, `TournamentClient`, `LadderClient`, `MapClient`, `MessageClient`, `NewsClient`, `UserClient`, `HistoryClient`, `NotificationClient`

These are instantiated via `clientFactory.createClient(ClientClass)` and should never be imported directly in components or pages.

---

## Data Flow Summary

```
User Action
    → Component event handler
    → dispatch(asyncThunk())
    → Thunk calls API via injected client (extra.createClient)
    → API response updates Redux slice state
    → useAppSelector / connect re-renders component
```

For real-time events:

```
SignalR message
    → notificationService handler
    → dispatch(action)
    → Redux state update
    → Component re-render
```

---

## Conventions for Agents

### When Adding a New Page

1. Create the page file under `src/pages/` following Next.js routing.
2. Use the `AppNextPage` type and set `needsLogin` and `getTitle`.
3. Define a local `selector` function for state extraction.
4. Use `useAppSelector` and `useDispatch<AppDispatch>()` (hooks pattern).
5. Implement `getInitialProps` to dispatch thunks for SSR data loading.
6. Use layout primitives (`GridContainer`, `GridRow`, `GridColumn`).

### When Adding a New Redux Slice

1. Create `<domain>.slice.ts` in the appropriate `src/lib/domain/` subdirectory.
2. Use `createSlice` and `createAsyncThunk` from Redux Toolkit.
3. Type thunks with `AppThunkArg` as the third generic parameter.
4. Access API clients via `thunkAPI.extra.createClient(ClientClass)`.
5. Add the reducer to `src/reducers.ts`.
6. If the slice is complex, split into `.state.ts`, `.handlers.ts`, `.selectors.ts`, and `.actions.ts` files.

### When Adding a New Component

1. Use functional components with hooks (`useAppSelector`, `useDispatch`).
2. Do **not** use the `connect()` HOC for new code.
3. Follow the existing patterns in `src/components/play/sidebar.tsx` or `src/components/play/gameStats.tsx`.

### When Working with Forms

1. Use the existing `Form` component from `src/lib/domain/shared/forms/form.tsx`.
2. Use `ControlledTextField`, `ControlledDropdown`, etc. for inputs.
3. Handle submission via the `onSubmit` callback which receives `(formState, dispatch)`.

### When Working with API Clients

1. API clients in `src/external/` are auto-generated — do **not** edit them manually.
2. Always access them via `thunkAPI.extra.createClient(ClientClass)` inside thunks.
3. SignalR clients are hand-written in `src/clients/signalrFactory.ts`.

### i18n

- Use the `__("key")` function from `src/i18n/i18n.ts` for all user-facing strings.
- Translations are extracted to `loc/` using `i18n-extract` and `i18next-scanner`.

### Testing

There is currently no test infrastructure in this project.

---

## Documentation

### E2E Testing Setup

Complete instructions for setting up a local development environment with both the backend and frontend are available in [`docs/E2E_SETUP.md`](../docs/E2E_SETUP.md).

Key points for local development:
- **Backend**: The backend repository is [cschleiden/imperaplus-backend](https://github.com/cschleiden/imperaplus-backend) (.NET Core API)
- **Configuration**: The frontend connects to the backend via `baseUri` in `src/configuration.ts` (defaults to production at `https://www.imperaonline.de`)
- **Local setup**: For local development, temporarily modify `src/configuration.ts` to point to `http://localhost:5000` (or your local backend URL)
- **Docker**: When running in Docker, use the `BASE_URI` environment variable which is substituted at runtime

The E2E setup guide covers:
- Backend and frontend installation and configuration
- Database setup options
- Running the complete stack locally
- Docker-based development with docker-compose
- Troubleshooting common issues (CORS, SSL, SignalR, port conflicts)

import {
    ErrorResponse,
    Game,
    GameChatMessage,
    GameSummary,
    HistoryTurn,
    Player,
} from "../../../../external/imperaClients";
import { MapTemplateCacheEntry } from "./mapTemplateCache";

export interface ITwoCountry {
    originCountryIdentifier: string;
    destinationCountryIdentifier: string;
    numberOfUnits: number;
    minUnits: number;
    maxUnits: number;
    allowedDestinations: string[];
}

export interface IGameUIOptions {
    showTeamsOnMap: boolean;
}

export const initialState = {
    gameId: 0,
    game: null as Game,

    gameChat: {
        // Initially do not allow sending messages, until state is retrieved
        isPending: true,
        all: [] as GameChatMessage[],
        team: [] as GameChatMessage[],
    },

    historyTurn: null as HistoryTurn,

    /** Current user's player */
    player: null as Player,

    /** Map template name */
    mapTemplate: null as MapTemplateCacheEntry,

    placeCountries: {} as { [id: string]: number },

    twoCountry: {
        originCountryIdentifier: null as string,
        destinationCountryIdentifier: null as string,
        numberOfUnits: 0,
        minUnits: 0,
        maxUnits: 0,
        allowedDestinations: [],
    } as ITwoCountry,

    attacksLeftPerTurn: 0,
    movesLeftPerTurn: 0,

    sidebarOpen: false,
    gameUiOptions:
        // (options && JSON.parse(options)) || // TODO: CS: Persist and restore
        {
            showTeamsOnMap: true,
        } as IGameUIOptions,
    overrideGameUiOptions: {} as Partial<IGameUIOptions>,

    operationInProgress: false,

    /** Value indicating whether current turn is displayed or history */
    historyActive: false,

    /** Other games where it's the player's turn */
    otherGames: [] as GameSummary[],

    error: null as ErrorResponse,
};

export type PlaySliceState = typeof initialState;

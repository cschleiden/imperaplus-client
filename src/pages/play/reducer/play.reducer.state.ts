import { makeImmutable } from "immuts";
import {
    GameSummary, Game, Player, GameChatMessage, HistoryTurn, ErrorResponse
} from "../../../external/imperaClients";
import { MapTemplateCacheEntry } from "../mapTemplateCache";

export interface ITwoCountry {
    originCountryIdentifier: string;
    destinationCountryIdentifier: string;
    numberOfUnits: number;
    minUnits: number;
    maxUnits: number;
    allowedDestinations: string[];
}

export const initialState = makeImmutable({
    gameId: 0,
    game: null as Game,

    gameChat: {
        // Initially do not allow sending messages, until state is retrieved
        isPending: true,
        all: [] as GameChatMessage[],
        team: [] as GameChatMessage[]
    },

    historyTurn: null as HistoryTurn,

    /** Current user's player */
    player: null as Player,
    mapTemplate: null as MapTemplateCacheEntry,

    placeCountries: {} as { [id: string]: number },

    twoCountry: {
        originCountryIdentifier: null as string,
        destinationCountryIdentifier: null as string,
        numberOfUnits: 0,
        minUnits: 0,
        maxUnits: 0,
        allowedDestinations: []
    } as ITwoCountry,

    attacksLeftPerTurn: 0,
    movesLeftPerTurn: 0,

    sidebarOpen: false,
    operationInProgress: true,

    /** Value indicating whether current turn is displayed or history */
    historyActive: false,

    /** Other games where it's the player's turn */
    otherGames: [] as GameSummary[],

    error: null as ErrorResponse
});

export type IPlayState = typeof initialState;
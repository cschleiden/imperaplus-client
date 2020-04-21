export interface LoginRequest {
    grant_type?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    scope?: string | undefined;
    refresh_token?: string | undefined;
}

export interface LoginResponseModel {
    access_token?: string | undefined;
    refresh_token?: string | undefined;
}

export interface UserInfo {
    userId?: string | undefined;
    userName?: string | undefined;
    hasRegistered: boolean;
    loginProvider?: string | undefined;
    language?: string | undefined;
    roles?: string[] | undefined;
    allianceId?: string | undefined;
    allianceAdmin: boolean;
}

export interface ManageInfoViewModel {
    localLoginProvider?: string | undefined;
    userName?: string | undefined;
    logins?: UserLoginInfoViewModel[] | undefined;
    externalLoginProviders?: ExternalLoginViewModel[] | undefined;
}

export interface UserLoginInfoViewModel {
    loginProvider?: string | undefined;
    providerKey?: string | undefined;
}

export interface ExternalLoginViewModel {
    name?: string | undefined;
    authenticationScheme?: string | undefined;
}

export interface ChangePasswordBindingModel {
    oldPassword: string;
    newPassword: string;
    confirmPassword?: string | undefined;
}

export interface SetPasswordBindingModel {
    newPassword: string;
    confirmPassword?: string | undefined;
}

export interface DeleteAccountBindingModel {
    password: string;
}

export interface ErrorResponse {
    error?: string | undefined;
    error_Description?: string | undefined;
    parameter_Errors?: { [key: string]: string[] } | undefined;
}

export interface RemoveLoginBindingModel {
    loginProvider: string;
    providerKey: string;
}

export interface RegisterBindingModel {
    userName: string;
    password: string;
    confirmPassword?: string | undefined;
    email: string;
    language: string;
    callbackUrl: string;
}

export interface ResendConfirmationModel {
    callbackUrl: string;
    userName: string;
    password: string;
    language: string;
}

export interface ConfirmationModel {
    userId: string;
    code: string;
}

export interface ForgotPasswordViewModel {
    callbackUrl: string;
    userName: string;
    email: string;
    language: string;
}

export interface ResetPasswordViewModel {
    userId: string;
    password: string;
    confirmPassword?: string | undefined;
    code: string;
}

export interface RegisterExternalBindingModel {
    userName: string;
    email: string;
}

export interface AllianceSummary {
    id: string;
    name?: string | undefined;
    description?: string | undefined;
    numberOfMembers: number;
    admins?: UserReference[] | undefined;
}

export interface UserReference {
    id?: string | undefined;
    name?: string | undefined;
}

export interface AllianceJoinRequest {
    id: string;
    createdAt: string;
    allianceId: string;
    lastModifiedAt: string;
    requestedByUser?: UserReference | undefined;
    state: AllianceJoinRequestState;
    reason?: string | undefined;
}

export enum AllianceJoinRequestState {
    Active = "Active",
    Approved = "Approved",
    Denied = "Denied",
}

export interface Alliance extends AllianceSummary {
    members?: UserReference[] | undefined;
}

export interface AllianceCreationOptions {
    name: string;
    description: string;
}

export interface GameSummary {
    id: number;
    type: GameType;
    name?: string | undefined;
    hasPassword: boolean;
    ladderId?: string | undefined;
    ladderName?: string | undefined;
    options?: GameOptions | undefined;
    createdByUserId?: string | undefined;
    createdByName?: string | undefined;
    startedAt?: string | undefined;
    lastActionAt: string;
    timeoutSecondsLeft: number;
    mapTemplate?: string | undefined;
    state: GameState;
    currentPlayer?: PlayerSummary | undefined;
    teams?: TeamSummary[] | undefined;
    turnCounter: number;
}

export enum GameType {
    Fun = "Fun",
    Ranking = "Ranking",
    Tournament = "Tournament",
}

export interface GameOptions {
    numberOfPlayersPerTeam: number;
    numberOfTeams: number;
    minUnitsPerCountry: number;
    newUnitsPerTurn: number;
    attacksPerTurn: number;
    movesPerTurn: number;
    initialCountryUnits: number;
    mapDistribution: MapDistribution;
    timeoutInSeconds: number;
    maximumTimeoutsPerPlayer: number;
    maximumNumberOfCards: number;
    victoryConditions: VictoryConditionType[];
    visibilityModifier: VisibilityModifierType[];
}

export enum MapDistribution {
    Default = "Default",
    Malibu = "Malibu",
}

export enum VictoryConditionType {
    Survival = "Survival",
    ControlContinent = "ControlContinent",
}

export enum VisibilityModifierType {
    None = "None",
    Fog = "Fog",
}

export enum GameState {
    None = "None",
    Open = "Open",
    Active = "Active",
    Ended = "Ended",
}

export interface PlayerSummary {
    id: string;
    userId?: string | undefined;
    name?: string | undefined;
    state: PlayerState;
    outcome: PlayerOutcome;
    teamId: string;
    playOrder: number;
    timeouts: number;
}

export enum PlayerState {
    None = "None",
    Active = "Active",
    InActive = "InActive",
}

export enum PlayerOutcome {
    None = "None",
    Won = "Won",
    Defeated = "Defeated",
    Surrendered = "Surrendered",
    Timeout = "Timeout",
}

export interface TeamSummary {
    id: string;
    playOrder: number;
    players?: PlayerSummary[] | undefined;
}

export interface GameCreationOptions extends GameOptions {
    name: string;
    password?: string | undefined;
    addBot: boolean;
    mapTemplate: string;
}

export interface Game {
    id: number;
    type: GameType;
    name?: string | undefined;
    hasPassword: boolean;
    mapTemplate?: string | undefined;
    teams?: Team[] | undefined;
    state: GameState;
    playState: PlayState;
    currentPlayer?: PlayerSummary | undefined;
    map?: Map | undefined;
    options?: GameOptions | undefined;
    lastModifiedAt: string;
    timeoutSecondsLeft: number;
    turnCounter: number;
    unitsToPlace: number;
    attacksInCurrentTurn: number;
    movesInCurrentTurn: number;
}

export interface Team {
    id: string;
    playOrder: number;
    players?: Player[] | undefined;
}

export interface Player extends PlayerSummary {
    cards?: BonusCard[] | undefined;
    placedInitialUnits: boolean;
    numberOfUnits: number;
    numberOfCountries: number;
}

export enum BonusCard {
    A = "A",
    B = "B",
    C = "C",
}

export enum PlayState {
    None = "None",
    PlaceUnits = "PlaceUnits",
    Attack = "Attack",
    Move = "Move",
    Done = "Done",
}

export interface Map {
    countries?: Country[] | undefined;
}

export interface Country {
    identifier?: string | undefined;
    playerId: string;
    teamId: string;
    units: number;
}

export interface GameChatMessage {
    id: number;
    gameId: number;
    user?: UserReference | undefined;
    teamId: string;
    dateTime: string;
    text?: string | undefined;
}

export interface HistoryTurn {
    gameId: number;
    turnId: number;
    actions?: HistoryEntry[] | undefined;
    game?: Game | undefined;
}

export interface HistoryEntry {
    id: number;
    turnNo: number;
    dateTime: string;
    actorId: string;
    otherPlayerId?: string | undefined;
    action: HistoryAction;
    originIdentifier?: string | undefined;
    destinationIdentifier?: string | undefined;
    units?: number | undefined;
    unitsLost?: number | undefined;
    unitsLostOther?: number | undefined;
    result?: boolean | undefined;
}

export enum HistoryAction {
    None = "None",
    StartGame = "StartGame",
    EndGame = "EndGame",
    PlaceUnits = "PlaceUnits",
    Attack = "Attack",
    Move = "Move",
    ExchangeCards = "ExchangeCards",
    PlayerLost = "PlayerLost",
    PlayerWon = "PlayerWon",
    PlayerTimeout = "PlayerTimeout",
    OwnerChange = "OwnerChange",
    EndTurn = "EndTurn",
    PlayerSurrendered = "PlayerSurrendered",
}

export interface LadderSummary {
    id: string;
    name?: string | undefined;
    options?: GameOptions | undefined;
    standing?: LadderStanding | undefined;
    isQueued: boolean;
    queueCount: number;
    mapTemplates: string[];
}

export interface LadderStanding {
    userId?: string | undefined;
    userName?: string | undefined;
    position: number;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    rating: number;
    lastGame: string;
}

export interface Ladder extends LadderSummary {
    standings?: LadderStanding[] | undefined;
    isActive: boolean;
}

export interface MapTemplateDescriptor {
    name?: string | undefined;
    isActive: boolean;
}

export interface MapTemplate {
    name?: string | undefined;
    image?: string | undefined;
    countries?: CountryTemplate[] | undefined;
    connections?: Connection[] | undefined;
    continents?: Continent[] | undefined;
}

export interface CountryTemplate {
    identifier?: string | undefined;
    name?: string | undefined;
    x: number;
    y: number;
}

export interface Connection {
    origin?: string | undefined;
    destination?: string | undefined;
}

export interface Continent {
    id: number;
    name?: string | undefined;
    bonus: number;
    countries?: string[] | undefined;
}

export enum MessageFolder {
    None = "None",
    Inbox = "Inbox",
    Sent = "Sent",
}

export interface SendMessage {
    to: UserReference;
    subject?: string | undefined;
    text?: string | undefined;
}

export interface Message extends SendMessage {
    id: string;
    from?: UserReference | undefined;
    folder: MessageFolder;
    sentAt: string;
    isRead: boolean;
}

export interface FolderInformation {
    folder: MessageFolder;
    count: number;
    unreadCount: number;
}

export interface NewsItem {
    dateTime: string;
    postedBy?: string | undefined;
    content?: NewsContent[] | undefined;
}

export interface NewsContent {
    language?: string | undefined;
    title?: string | undefined;
    text?: string | undefined;
}

export interface NotificationSummary {
    numberOfGames: number;
    numberOfMessages: number;
}

export interface PlaceUnitsOptions {
    countryIdentifier: string;
    numberOfUnits: number;
}

export interface GameActionResult {
    id: number;
    turnCounter: number;
    teams?: Team[] | undefined;
    state: GameState;
    playState: PlayState;
    countryUpdates?: Country[] | undefined;
    actionResult: Result;
    unitsToPlace: number;
    attacksInCurrentTurn: number;
    movesInCurrentTurn: number;
    cards?: BonusCard[] | undefined;
    currentPlayer?: Player | undefined;
}

export enum Result {
    None = "None",
    Successful = "Successful",
    NotSuccessful = "NotSuccessful",
}

export interface AttackOptions {
    originCountryIdentifier: string;
    destinationCountryIdentifier: string;
    numberOfUnits: number;
}

export interface MoveOptions {
    originCountryIdentifier: string;
    destinationCountryIdentifier: string;
    numberOfUnits: number;
}

export interface TournamentSummary {
    id: string;
    name: string;
    state: TournamentState;
    options?: GameOptions | undefined;
    numberOfTeams: number;
    numberOfGroupGames: number;
    numberOfKnockoutGames: number;
    numberOfFinalGames: number;
    startOfRegistration: string;
    startOfTournament: string;
    endOfTournament: string;
}

export enum TournamentState {
    Open = "Open",
    Groups = "Groups",
    Knockout = "Knockout",
    Closed = "Closed",
}

export interface Tournament extends TournamentSummary {
    teams?: TournamentTeam[] | undefined;
    groups?: TournamentGroup[] | undefined;
    pairings?: TournamentPairing[] | undefined;
    mapTemplates?: string[] | undefined;
    winner?: TournamentTeam | undefined;
    phase: number;
}

export interface TournamentTeamSummary {
    id: string;
    name?: string | undefined;
    createdById?: string | undefined;
    groupOrder: number;
    state: TournamentTeamState;
}

export interface TournamentTeam extends TournamentTeamSummary {
    participants?: UserReference[] | undefined;
}

export enum TournamentTeamState {
    Open = "Open",
    Active = "Active",
    InActive = "InActive",
}

export interface TournamentGroup {
    id: string;
    teams?: TournamentTeamSummary[] | undefined;
}

export interface TournamentPairing {
    id: string;
    teamA?: TournamentTeamSummary | undefined;
    teamB?: TournamentTeamSummary | undefined;
    teamAWon: number;
    teamBWon: number;
    numberOfGames: number;
    phase: number;
    order: number;
}

export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
}

export class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any };
    result: any;

    constructor(
        message: string,
        status: number,
        response: string,
        headers: { [key: string]: any },
        result: any
    ) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

export function throwException(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result?: any
): any {
    if (result !== null && result !== undefined) throw result;
    else throw new SwaggerException(message, status, response, headers, null);
}

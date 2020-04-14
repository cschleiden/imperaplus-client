import { PlaceUnitsOptions, GameActionResult, throwException, AttackOptions, MoveOptions, Game } from "./imperaClients";
export class PlayClient {
    private http: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    constructor(baseUrl?: string, http?: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    }) {
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:57676";
    }
    /**
     * Place units to countries.
     * @gameId Id of the game
     * @placeUnitsOptions List of country/unit count pairs
     * @return GameActionResult of action
     */
    postPlace(gameId: number, placeUnitsOptions: PlaceUnitsOptions[] | null): Promise<GameActionResult | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/play/place";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(placeUnitsOptions);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostPlace(_response);
        });
    }
    protected processPostPlace(response: Response): Promise<GameActionResult | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 =
                    _responseText === ""
                        ? null
                        : <GameActionResult>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<GameActionResult | null>(<any>null);
    }
    /**
     * Exchange cards for the current player. Which cards to exchange is automatically chosen to gain the most bonus for the player.
     * @gameId Id of the game
     * @return GameActionResult of action
     */
    postExchange(gameId: number): Promise<GameActionResult | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/play/exchange";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostExchange(_response);
        });
    }
    protected processPostExchange(response: Response): Promise<GameActionResult | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 =
                    _responseText === ""
                        ? null
                        : <GameActionResult>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<GameActionResult | null>(<any>null);
    }
    /**
     * Attack from one to another country.
     * @gameId Id of the game
     * @options Options for the command
     * @return GameActionResult of action
     */
    postAttack(gameId: number, options: AttackOptions | null): Promise<GameActionResult | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/play/attack";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(options);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostAttack(_response);
        });
    }
    protected processPostAttack(response: Response): Promise<GameActionResult | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 =
                    _responseText === ""
                        ? null
                        : <GameActionResult>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<GameActionResult | null>(<any>null);
    }
    /**
     * Switch to moving.
     * @gameId Id of the game
     * @return GameActionResult of action
     */
    postEndAttack(gameId: number): Promise<GameActionResult | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/play/endattack";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostEndAttack(_response);
        });
    }
    protected processPostEndAttack(response: Response): Promise<GameActionResult | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 =
                    _responseText === ""
                        ? null
                        : <GameActionResult>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<GameActionResult | null>(<any>null);
    }
    /**
     * Move units between countries. Only allowed after placing. Cancels any attacks that the player had left before. Attacking is not
    possible anymore after moving.
     * @gameId Id of the game
     * @options Options for the command
     * @return GameActionResult of action
     */
    postMove(gameId: number, options: MoveOptions | null): Promise<GameActionResult | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/play/move";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(options);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostMove(_response);
        });
    }
    protected processPostMove(response: Response): Promise<GameActionResult | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 =
                    _responseText === ""
                        ? null
                        : <GameActionResult>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<GameActionResult | null>(<any>null);
    }
    /**
     * End the current turn
     * @gameId Id of the game
     * @return GameActionResult of action
     */
    postEndTurn(gameId: number): Promise<Game | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/play/endturn";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostEndTurn(_response);
        });
    }
    protected processPostEndTurn(response: Response): Promise<Game | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 =
                    _responseText === ""
                        ? null
                        : <Game>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Game | null>(<any>null);
    }
}

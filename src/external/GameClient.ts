import {
    GameSummary,
    throwException,
    GameCreationOptions,
    Game,
    FileResponse,
    GameChatMessage,
} from "./imperaClients";
export class GameClient {
    private http: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
        undefined;
    constructor(
        baseUrl?: string,
        http?: {
            fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
        }
    ) {
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:57676";
    }
    /**
     * Get a list of open games, excluding games by the current player
     * @return List of games
     */
    getAll(): Promise<GameSummary[] | null> {
        let url_ = this.baseUrl + "/api/games/open";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetAll(_response);
        });
    }
    protected processGetAll(response: Response): Promise<GameSummary[] | null> {
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
                        : <GameSummary[]>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<GameSummary[] | null>(<any>null);
    }
    /**
     * Get a list of the games for the current player
     * @return List of games for the current user
     */
    getMy(): Promise<GameSummary[] | null> {
        let url_ = this.baseUrl + "/api/games/my";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetMy(_response);
        });
    }
    protected processGetMy(response: Response): Promise<GameSummary[] | null> {
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
                        : <GameSummary[]>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<GameSummary[] | null>(<any>null);
    }
    /**
     * Get list of games where it's the current player's team
     * @return List of games where it's the current user's team
     */
    getMyTurn(): Promise<GameSummary[] | null> {
        let url_ = this.baseUrl + "/api/games/myturn";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetMyTurn(_response);
        });
    }
    protected processGetMyTurn(
        response: Response
    ): Promise<GameSummary[] | null> {
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
                        : <GameSummary[]>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<GameSummary[] | null>(<any>null);
    }
    /**
     * Create a new game
     * @creationOptions Creation options
     * @return Summary of newly created game
     */
    post(
        creationOptions: GameCreationOptions | null
    ): Promise<GameSummary | null> {
        let url_ = this.baseUrl + "/api/games";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(creationOptions);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPost(_response);
        });
    }
    protected processPost(response: Response): Promise<GameSummary | null> {
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
                        : <GameSummary>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<GameSummary | null>(<any>null);
    }
    /**
     * Get detailed information about a single game
     * @gameId Id of the requested game
     * @return Information about the requested game
     */
    get(gameId: number): Promise<Game | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGet(_response);
        });
    }
    protected processGet(response: Response): Promise<Game | null> {
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
                        : <Game>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<Game | null>(<any>null);
    }
    /**
     * Cancel/delete the requested game, if possible.
     * @gameId Id of the game to delete
     * @return Status
     */
    delete(gameId: number): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processDelete(_response);
        });
    }
    protected processDelete(response: Response): Promise<FileResponse | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers
                ? response.headers.get("content-disposition")
                : undefined;
            const fileNameMatch = contentDisposition
                ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition)
                : undefined;
            const fileName =
                fileNameMatch && fileNameMatch.length > 1
                    ? fileNameMatch[1]
                    : undefined;
            return response.blob().then((blob) => {
                return {
                    fileName: fileName,
                    data: blob,
                    status: status,
                    headers: _headers,
                };
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
    /**
     * Get messages for a single game
     * @gameId Id of the requested game
     * @isPublic (optional) Value indicating whether to return only public messages, default is true
     * @return Messages posted in the requested game
     */
    getMessages(
        gameId: number,
        isPublic: boolean | undefined
    ): Promise<GameChatMessage[] | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/messages?";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        if (isPublic === null)
            throw new Error("The parameter 'isPublic' cannot be null.");
        else if (isPublic !== undefined)
            url_ += "isPublic=" + encodeURIComponent("" + isPublic) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetMessages(_response);
        });
    }
    protected processGetMessages(
        response: Response
    ): Promise<GameChatMessage[] | null> {
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
                        : <GameChatMessage[]>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<GameChatMessage[] | null>(<any>null);
    }
    /**
     * Join the given game
     * @gameId Id of game to join
     * @password Optional password
     */
    postJoin(
        gameId: number,
        password: string | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/join?";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        if (password === undefined)
            throw new Error("The parameter 'password' must be defined.");
        else url_ += "password=" + encodeURIComponent("" + password) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostJoin(_response);
        });
    }
    protected processPostJoin(
        response: Response
    ): Promise<FileResponse | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers
                ? response.headers.get("content-disposition")
                : undefined;
            const fileNameMatch = contentDisposition
                ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition)
                : undefined;
            const fileName =
                fileNameMatch && fileNameMatch.length > 1
                    ? fileNameMatch[1]
                    : undefined;
            return response.blob().then((blob) => {
                return {
                    fileName: fileName,
                    data: blob,
                    status: status,
                    headers: _headers,
                };
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
    /**
     * Leave the given game, only possible if game hasn't started yet, and current player
    is not the creator.
     * @gameId Id of game to leave
     */
    postLeave(gameId: number): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/leave";
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
            return this.processPostLeave(_response);
        });
    }
    protected processPostLeave(
        response: Response
    ): Promise<FileResponse | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers
                ? response.headers.get("content-disposition")
                : undefined;
            const fileNameMatch = contentDisposition
                ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition)
                : undefined;
            const fileName =
                fileNameMatch && fileNameMatch.length > 1
                    ? fileNameMatch[1]
                    : undefined;
            return response.blob().then((blob) => {
                return {
                    fileName: fileName,
                    data: blob,
                    status: status,
                    headers: _headers,
                };
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
    /**
     * Surrender in the given game, only possible if current player
    and game are still active.
     * @gameId Id of game to surrender in
     */
    postSurrender(gameId: number): Promise<GameSummary | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/surrender";
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
            return this.processPostSurrender(_response);
        });
    }
    protected processPostSurrender(
        response: Response
    ): Promise<GameSummary | null> {
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
                        : <GameSummary>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<GameSummary | null>(<any>null);
    }
    /**
     * Hides the given game for the current player
     * @gameId Id of game to hide
     */
    patchHide(gameId: number): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/hide";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPatchHide(_response);
        });
    }
    protected processPatchHide(
        response: Response
    ): Promise<FileResponse | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers
                ? response.headers.get("content-disposition")
                : undefined;
            const fileNameMatch = contentDisposition
                ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition)
                : undefined;
            const fileName =
                fileNameMatch && fileNameMatch.length > 1
                    ? fileNameMatch[1]
                    : undefined;
            return response.blob().then((blob) => {
                return {
                    fileName: fileName,
                    data: blob,
                    status: status,
                    headers: _headers,
                };
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
    /**
     * Hide all games which can be hidden for the current player
     */
    patchHideAll(): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/games/hide";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPatchHideAll(_response);
        });
    }
    protected processPatchHideAll(
        response: Response
    ): Promise<FileResponse | null> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers
                ? response.headers.get("content-disposition")
                : undefined;
            const fileNameMatch = contentDisposition
                ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition)
                : undefined;
            const fileName =
                fileNameMatch && fileNameMatch.length > 1
                    ? fileNameMatch[1]
                    : undefined;
            return response.blob().then((blob) => {
                return {
                    fileName: fileName,
                    data: blob,
                    status: status,
                    headers: _headers,
                };
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException(
                    "An unexpected server error occurred.",
                    status,
                    _responseText,
                    _headers
                );
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
}

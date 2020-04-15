import { TournamentSummary, throwException, Tournament, TournamentTeam, GameSummary, FileResponse } from "./imperaClients";
export class TournamentClient {
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
     * Returns tournaments
     * @return List of tournaments
     */
    getAll(): Promise<TournamentSummary[] | null> {
        let url_ = this.baseUrl + "/api/tournaments";
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
    protected processGetAll(response: Response): Promise<TournamentSummary[] | null> {
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
                        : <TournamentSummary[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TournamentSummary[] | null>(<any>null);
    }
    /**
     * Get tournament identified by Id
     * @tournamentId Id of tournament
     */
    getById(tournamentId: string): Promise<Tournament | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetById(_response);
        });
    }
    protected processGetById(response: Response): Promise<Tournament | null> {
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
                        : <Tournament>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Tournament | null>(<any>null);
    }
    /**
     * Join tournament
     * @tournamentId Id of tournament
     */
    postJoin(tournamentId: string): Promise<TournamentTeam | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
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
    protected processPostJoin(response: Response): Promise<TournamentTeam | null> {
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
                        : <TournamentTeam>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TournamentTeam | null>(<any>null);
    }
    /**
     * Get teams for tournament
     * @tournamentId Id of tournament
     */
    getTeams(tournamentId: string): Promise<TournamentTeam[] | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}/teams";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetTeams(_response);
        });
    }
    protected processGetTeams(response: Response): Promise<TournamentTeam[] | null> {
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
                        : <TournamentTeam[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TournamentTeam[] | null>(<any>null);
    }
    /**
     * Create new team for a tournament
     * @tournamentId Id of tournament
     * @name Name of team
     * @password (optional) Optional password for team
     * @return Summary of newly created team
     */
    postCreateTeam(tournamentId: string, name: string | null, password: string | null | undefined): Promise<TournamentTeam | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}/teams?";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
        if (name === undefined)
            throw new Error("The parameter 'name' must be defined.");
        else
            url_ += "name=" + encodeURIComponent("" + name) + "&";
        if (password !== undefined)
            url_ += "password=" + encodeURIComponent("" + password) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostCreateTeam(_response);
        });
    }
    protected processPostCreateTeam(response: Response): Promise<TournamentTeam | null> {
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
                        : <TournamentTeam>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TournamentTeam | null>(<any>null);
    }
    /**
     * Get teams for tournament pairing
     * @pairingId Id of tournament pairing
     */
    getGamesForPairing(pairingId: string): Promise<GameSummary[] | null> {
        let url_ = this.baseUrl + "/api/tournaments/pairings/{pairingId}";
        if (pairingId === undefined || pairingId === null)
            throw new Error("The parameter 'pairingId' must be defined.");
        url_ = url_.replace("{pairingId}", encodeURIComponent("" + pairingId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetGamesForPairing(_response);
        });
    }
    protected processGetGamesForPairing(response: Response): Promise<GameSummary[] | null> {
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
                        : <GameSummary[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<GameSummary[] | null>(<any>null);
    }
    /**
     * Join existing team
     * @tournamentId Id of tournament
     * @teamId Id of team
     * @password (optional) Optional password for team to join
     */
    postJoinTeam(tournamentId: string, teamId: string, password: string | null | undefined): Promise<TournamentTeam | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}/teams/{teamId}?";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
        if (teamId === undefined || teamId === null)
            throw new Error("The parameter 'teamId' must be defined.");
        url_ = url_.replace("{teamId}", encodeURIComponent("" + teamId));
        if (password !== undefined)
            url_ += "password=" + encodeURIComponent("" + password) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostJoinTeam(_response);
        });
    }
    protected processPostJoinTeam(response: Response): Promise<TournamentTeam | null> {
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
                        : <TournamentTeam>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TournamentTeam | null>(<any>null);
    }
    /**
     * Delete a team. Only allowed if user created it
     * @tournamentId Id of tournament
     * @teamId Id of team to delete
     */
    deleteTeam(tournamentId: string, teamId: string): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}/teams/{teamId}";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
        if (teamId === undefined || teamId === null)
            throw new Error("The parameter 'teamId' must be defined.");
        url_ = url_.replace("{teamId}", encodeURIComponent("" + teamId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processDeleteTeam(_response);
        });
    }
    protected processDeleteTeam(response: Response): Promise<FileResponse | null> {
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
            const fileName = fileNameMatch && fileNameMatch.length > 1
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
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
    /**
     * Leave a team and tournament
     * @tournamentId Id of tournament
     */
    leaveTournament(tournamentId: string): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/tournaments/{tournamentId}/teams/me";
        if (tournamentId === undefined || tournamentId === null)
            throw new Error("The parameter 'tournamentId' must be defined.");
        url_ = url_.replace("{tournamentId}", encodeURIComponent("" + tournamentId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processLeaveTournament(_response);
        });
    }
    protected processLeaveTournament(response: Response): Promise<FileResponse | null> {
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
            const fileName = fileNameMatch && fileNameMatch.length > 1
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
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FileResponse | null>(<any>null);
    }
}

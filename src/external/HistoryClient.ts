import { HistoryTurn, throwException } from "./imperaClients";
export class HistoryClient {
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
     * Gets the specified turn including the actions and current state of the map
     */
    getTurn(gameId: number, turnId: number): Promise<HistoryTurn | null> {
        let url_ = this.baseUrl + "/api/games/{gameId}/history/{turnId}";
        if (gameId === undefined || gameId === null)
            throw new Error("The parameter 'gameId' must be defined.");
        url_ = url_.replace("{gameId}", encodeURIComponent("" + gameId));
        if (turnId === undefined || turnId === null)
            throw new Error("The parameter 'turnId' must be defined.");
        url_ = url_.replace("{turnId}", encodeURIComponent("" + turnId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetTurn(_response);
        });
    }
    protected processGetTurn(response: Response): Promise<HistoryTurn | null> {
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
                        : <HistoryTurn>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<HistoryTurn | null>(<any>null);
    }
}

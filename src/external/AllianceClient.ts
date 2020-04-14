import { AllianceSummary, throwException, AllianceCreationOptions, AllianceJoinRequest, Alliance, AllianceJoinRequestState } from "./imperaClients";
export class AllianceClient {
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
     * Get a list of all alliances
     * @return Alliance summaries
     */
    getAll(): Promise<AllianceSummary[] | null> {
        let url_ = this.baseUrl + "/api/alliances";
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
    protected processGetAll(response: Response): Promise<AllianceSummary[] | null> {
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
                        : <AllianceSummary[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<AllianceSummary[] | null>(<any>null);
    }
    /**
     * Create a new alliance
     * @creationOptions Creation options
     * @return Summary of new alliance
     */
    create(creationOptions: AllianceCreationOptions | null): Promise<AllianceSummary | null> {
        let url_ = this.baseUrl + "/api/alliances";
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
            return this.processCreate(_response);
        });
    }
    protected processCreate(response: Response): Promise<AllianceSummary | null> {
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
                        : <AllianceSummary>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<AllianceSummary | null>(<any>null);
    }
    /**
     * Lists all requests to join an alliance by the current user
     * @return List of requests
     */
    getAllRequests(): Promise<AllianceJoinRequest[] | null> {
        let url_ = this.baseUrl + "/api/alliances/requests";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetAllRequests(_response);
        });
    }
    protected processGetAllRequests(response: Response): Promise<AllianceJoinRequest[] | null> {
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
                        : <AllianceJoinRequest[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<AllianceJoinRequest[] | null>(<any>null);
    }
    /**
     * Get detailed information about a single alliance
     * @allianceId Id of the requested alliance
     * @return Information about the requested alliance
     */
    get(allianceId: string): Promise<Alliance | null> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
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
    protected processGet(response: Response): Promise<Alliance | null> {
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
                        : <Alliance>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Alliance | null>(<any>null);
    }
    /**
     * Delete alliance
     * @allianceId Id of alliance
     * @return Summary of new alliance
     */
    delete(allianceId: string): Promise<void> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processDelete(_response);
        });
    }
    protected processDelete(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }
    /**
     * Remove member from alliance
     * @allianceId Id of alliance
     * @userId Id of user to remove
     * @return Summary of new alliance
     */
    removeMember(allianceId: string, userId: string): Promise<void> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}/members/{userId}";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
        if (userId === undefined || userId === null)
            throw new Error("The parameter 'userId' must be defined.");
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRemoveMember(_response);
        });
    }
    protected processRemoveMember(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }
    /**
     * Change member's admin status
     * @allianceId Id of alliance
     * @userId Id of user to make admin
     * @return Summary of new alliance
     */
    changeAdmin(allianceId: string, userId: string, isAdmin: boolean): Promise<void> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}/members/{userId}";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
        if (userId === undefined || userId === null)
            throw new Error("The parameter 'userId' must be defined.");
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(isAdmin);
        let options_ = <RequestInit>{
            body: content_,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processChangeAdmin(_response);
        });
    }
    protected processChangeAdmin(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }
    /**
     * Request to join an alliance
     * @allianceId Id of the requested alliance
     * @reason Reason why user wants to join the alliance
     * @return Id of join request if created
     */
    requestJoin(allianceId: string, reason: string | null): Promise<AllianceJoinRequest | null> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}/requests";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(reason);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRequestJoin(_response);
        });
    }
    protected processRequestJoin(response: Response): Promise<AllianceJoinRequest | null> {
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
                        : <AllianceJoinRequest>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<AllianceJoinRequest | null>(<any>null);
    }
    /**
     * Lists requests to join an alliance
     * @allianceId Id of the alliance
     * @return List of requests
     */
    getRequests(allianceId: string): Promise<AllianceJoinRequest[] | null> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}/requests";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetRequests(_response);
        });
    }
    protected processGetRequests(response: Response): Promise<AllianceJoinRequest[] | null> {
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
                        : <AllianceJoinRequest[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<AllianceJoinRequest[] | null>(<any>null);
    }
    /**
     * Updates a request to join an alliance. Requests can only be updated when they are in a pending state
     * @allianceId Id of the requested alliance
     * @requestId Id of the request to change
     * @state New request state
     */
    updateRequest(allianceId: string, requestId: string, state: AllianceJoinRequestState): Promise<AllianceJoinRequest | null> {
        let url_ = this.baseUrl + "/api/alliances/{allianceId}/requests/{requestId}";
        if (allianceId === undefined || allianceId === null)
            throw new Error("The parameter 'allianceId' must be defined.");
        url_ = url_.replace("{allianceId}", encodeURIComponent("" + allianceId));
        if (requestId === undefined || requestId === null)
            throw new Error("The parameter 'requestId' must be defined.");
        url_ = url_.replace("{requestId}", encodeURIComponent("" + requestId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(state);
        let options_ = <RequestInit>{
            body: content_,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processUpdateRequest(_response);
        });
    }
    protected processUpdateRequest(response: Response): Promise<AllianceJoinRequest | null> {
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
                        : <AllianceJoinRequest>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<AllianceJoinRequest | null>(<any>null);
    }
}

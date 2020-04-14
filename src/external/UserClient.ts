import { UserReference, throwException } from "./imperaClients";
export class UserClient {
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
     * Find users starting with the given query
     * @query Query to search for
     */
    findUsers(query: string): Promise<UserReference[] | null> {
        let url_ = this.baseUrl + "/api/users/find/{query}";
        if (query === undefined || query === null)
            throw new Error("The parameter 'query' must be defined.");
        url_ = url_.replace("{query}", encodeURIComponent("" + query));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processFindUsers(_response);
        });
    }
    protected processFindUsers(response: Response): Promise<UserReference[] | null> {
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
                        : <UserReference[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<UserReference[] | null>(<any>null);
    }
}

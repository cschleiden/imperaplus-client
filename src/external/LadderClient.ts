import {
    LadderSummary,
    throwException,
    Ladder,
    FileResponse,
} from "./imperaClients";
export class LadderClient {
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
     * Returns active ladders
     * @return List of ladders
     */
    getAll(): Promise<LadderSummary[] | null> {
        let url_ = this.baseUrl + "/api/ladder";
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
    protected processGetAll(
        response: Response
    ): Promise<LadderSummary[] | null> {
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
                        : <LadderSummary[]>(
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
        return Promise.resolve<LadderSummary[] | null>(<any>null);
    }
    /**
     * Gets ladder identified by given id
     * @ladderId Id of ladder
     */
    get(ladderId: string): Promise<Ladder | null> {
        let url_ = this.baseUrl + "/api/ladder/{ladderId}";
        if (ladderId === undefined || ladderId === null)
            throw new Error("The parameter 'ladderId' must be defined.");
        url_ = url_.replace("{ladderId}", encodeURIComponent("" + ladderId));
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
    protected processGet(response: Response): Promise<Ladder | null> {
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
                        : <Ladder>(
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
        return Promise.resolve<Ladder | null>(<any>null);
    }
    /**
     * Queue up for a new game in the given ladder
     * @ladderId Ladder id
     */
    postJoin(ladderId: string): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/ladder/{ladderId}/queue";
        if (ladderId === undefined || ladderId === null)
            throw new Error("The parameter 'ladderId' must be defined.");
        url_ = url_.replace("{ladderId}", encodeURIComponent("" + ladderId));
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
     * Leave the queue for a ladder
     * @ladderId Ladder Id
     */
    deleteJoin(ladderId: string): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/ladder/{ladderId}/queue";
        if (ladderId === undefined || ladderId === null)
            throw new Error("The parameter 'ladderId' must be defined.");
        url_ = url_.replace("{ladderId}", encodeURIComponent("" + ladderId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processDeleteJoin(_response);
        });
    }
    protected processDeleteJoin(
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

import { MessageFolder, Message, throwException, FileResponse, FolderInformation, SendMessage } from "./imperaClients";
export class MessageClient {
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
    getAll(messageFolder: MessageFolder): Promise<Message[] | null> {
        let url_ = this.baseUrl + "/api/messages/folder/{messageFolder}";
        if (messageFolder === undefined || messageFolder === null)
            throw new Error("The parameter 'messageFolder' must be defined.");
        url_ = url_.replace("{messageFolder}", encodeURIComponent("" + messageFolder));
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
    protected processGetAll(response: Response): Promise<Message[] | null> {
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
                        : <Message[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Message[] | null>(<any>null);
    }
    get(messageId: string): Promise<Message | null> {
        let url_ = this.baseUrl + "/api/messages/{messageId}";
        if (messageId === undefined || messageId === null)
            throw new Error("The parameter 'messageId' must be defined.");
        url_ = url_.replace("{messageId}", encodeURIComponent("" + messageId));
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
    protected processGet(response: Response): Promise<Message | null> {
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
                        : <Message>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Message | null>(<any>null);
    }
    patchMarkRead(messageId: string): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/messages/{messageId}";
        if (messageId === undefined || messageId === null)
            throw new Error("The parameter 'messageId' must be defined.");
        url_ = url_.replace("{messageId}", encodeURIComponent("" + messageId));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPatchMarkRead(_response);
        });
    }
    protected processPatchMarkRead(response: Response): Promise<FileResponse | null> {
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
    delete(messageId: string): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/messages/{messageId}";
        if (messageId === undefined || messageId === null)
            throw new Error("The parameter 'messageId' must be defined.");
        url_ = url_.replace("{messageId}", encodeURIComponent("" + messageId));
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
    getFolderInformation(): Promise<FolderInformation[] | null> {
        let url_ = this.baseUrl + "/api/messages/folders";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetFolderInformation(_response);
        });
    }
    protected processGetFolderInformation(response: Response): Promise<FolderInformation[] | null> {
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
                        : <FolderInformation[]>(JSON.parse(_responseText, this.jsonParseReviver));
                return result200;
            });
        }
        else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FolderInformation[] | null>(<any>null);
    }
    postSend(message: SendMessage | null): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/messages";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(message);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processPostSend(_response);
        });
    }
    protected processPostSend(response: Response): Promise<FileResponse | null> {
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

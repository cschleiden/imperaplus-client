import {
    MapTemplateDescriptor,
    throwException,
    MapTemplate,
} from "./imperaClients";
export class MapClient {
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
    getAllSummary(): Promise<MapTemplateDescriptor[] | null> {
        let url_ = this.baseUrl + "/api/map";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetAllSummary(_response);
        });
    }
    protected processGetAllSummary(
        response: Response
    ): Promise<MapTemplateDescriptor[] | null> {
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
                        : <MapTemplateDescriptor[]>(
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
        return Promise.resolve<MapTemplateDescriptor[] | null>(<any>null);
    }
    /**
     * Get map template identified by name
     */
    getMapTemplate(name: string): Promise<MapTemplate | null> {
        let url_ = this.baseUrl + "/api/map/{name}";
        if (name === undefined || name === null)
            throw new Error("The parameter 'name' must be defined.");
        url_ = url_.replace("{name}", encodeURIComponent("" + name));
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetMapTemplate(_response);
        });
    }
    protected processGetMapTemplate(
        response: Response
    ): Promise<MapTemplate | null> {
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
                        : <MapTemplate>(
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
        return Promise.resolve<MapTemplate | null>(<any>null);
    }
}

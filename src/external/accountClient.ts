import {
    LoginRequest,
    LoginResponseModel,
    throwException,
    UserInfo,
    FileResponse,
    ManageInfoViewModel,
    ChangePasswordBindingModel,
    SetPasswordBindingModel,
    DeleteAccountBindingModel,
    ErrorResponse,
    RemoveLoginBindingModel,
    ExternalLoginViewModel,
    RegisterBindingModel,
    ResendConfirmationModel,
    ConfirmationModel,
    ForgotPasswordViewModel,
    ResetPasswordViewModel,
    RegisterExternalBindingModel,
} from "./imperaClients";

export class AccountClient {
    private http: {
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
    };
    private baseUrl: string;
    protected jsonParseReviver:
        | ((key: string, value: any) => any)
        | undefined = undefined;
    constructor(
        baseUrl?: string,
        http?: {
            fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
        }
    ) {
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:57676";
    }
    exchange(
        loginRequest: LoginRequest | null | undefined
    ): Promise<LoginResponseModel | null> {
        let url_ = this.baseUrl + "/api/Account/token";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = new FormData();
        if (loginRequest !== null && loginRequest !== undefined)
            content_.append("loginRequest", loginRequest.toString());
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processExchange(_response);
        });
    }
    protected processExchange(
        response: Response
    ): Promise<LoginResponseModel | null> {
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
                        : <LoginResponseModel>(
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
        return Promise.resolve<LoginResponseModel | null>(<any>null);
    }
    /**
     * Checks if a username is available
     * @userName Username to check
     * @return True if username is available
     */
    getUserNameAvailable(userName: string | null): Promise<void> {
        let url_ = this.baseUrl + "/api/Account/UserNameAvailable?";
        if (userName === undefined)
            throw new Error("The parameter 'userName' must be defined.");
        else url_ += "userName=" + encodeURIComponent("" + userName) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetUserNameAvailable(_response);
        });
    }
    protected processGetUserNameAvailable(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
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
        return Promise.resolve<void>(<any>null);
    }
    /**
     * Get user information
     */
    getUserInfo(): Promise<UserInfo | null> {
        let url_ = this.baseUrl + "/api/Account/UserInfo";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetUserInfo(_response);
        });
    }
    protected processGetUserInfo(response: Response): Promise<UserInfo | null> {
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
                        : <UserInfo>(
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
        return Promise.resolve<UserInfo | null>(<any>null);
    }
    /**
     * Get user information for an external user (i.e., just logged in using an external provider)
     */
    getExternalUserInfo(): Promise<UserInfo | null> {
        let url_ = this.baseUrl + "/api/Account/ExternalUserInfo";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetExternalUserInfo(_response);
        });
    }
    protected processGetExternalUserInfo(
        response: Response
    ): Promise<UserInfo | null> {
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
                        : <UserInfo>(
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
        return Promise.resolve<UserInfo | null>(<any>null);
    }
    logout(): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/Logout";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processLogout(_response);
        });
    }
    protected processLogout(response: Response): Promise<FileResponse | null> {
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
    getManageInfo(
        returnUrl: string | null,
        generateState: boolean | undefined
    ): Promise<ManageInfoViewModel | null> {
        let url_ = this.baseUrl + "/api/Account/ManageInfo?";
        if (returnUrl === undefined)
            throw new Error("The parameter 'returnUrl' must be defined.");
        else url_ += "returnUrl=" + encodeURIComponent("" + returnUrl) + "&";
        if (generateState === null)
            throw new Error("The parameter 'generateState' cannot be null.");
        else if (generateState !== undefined)
            url_ +=
                "generateState=" + encodeURIComponent("" + generateState) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetManageInfo(_response);
        });
    }
    protected processGetManageInfo(
        response: Response
    ): Promise<ManageInfoViewModel | null> {
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
                        : <ManageInfoViewModel>(
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
        return Promise.resolve<ManageInfoViewModel | null>(<any>null);
    }
    changePassword(
        model: ChangePasswordBindingModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/ChangePassword";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processChangePassword(_response);
        });
    }
    protected processChangePassword(
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
    setPassword(
        model: SetPasswordBindingModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/SetPassword";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processSetPassword(_response);
        });
    }
    protected processSetPassword(
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
    deleteAccount(model: DeleteAccountBindingModel | null): Promise<void> {
        let url_ = this.baseUrl + "/api/Account/Delete";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processDeleteAccount(_response);
        });
    }
    protected processDeleteAccount(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400: any = null;
                result400 =
                    _responseText === ""
                        ? null
                        : <ErrorResponse>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return throwException(
                    "A server error occurred.",
                    status,
                    _responseText,
                    _headers,
                    result400
                );
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
        return Promise.resolve<void>(<any>null);
    }
    setLanguage(language: string | null): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/Language?";
        if (language === undefined)
            throw new Error("The parameter 'language' must be defined.");
        else url_ += "language=" + encodeURIComponent("" + language) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processSetLanguage(_response);
        });
    }
    protected processSetLanguage(
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
    removeLogin(
        model: RemoveLoginBindingModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/RemoveLogin";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRemoveLogin(_response);
        });
    }
    protected processRemoveLogin(
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
    getExternalLogins(): Promise<ExternalLoginViewModel[] | null> {
        let url_ = this.baseUrl + "/api/Account/ExternalLogins";
        url_ = url_.replace(/[?&]$/, "");
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetExternalLogins(_response);
        });
    }
    protected processGetExternalLogins(
        response: Response
    ): Promise<ExternalLoginViewModel[] | null> {
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
                        : <ExternalLoginViewModel[]>(
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
        return Promise.resolve<ExternalLoginViewModel[] | null>(<any>null);
    }
    register(model: RegisterBindingModel | null): Promise<void> {
        let url_ = this.baseUrl + "/api/Account/Register";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRegister(_response);
        });
    }
    protected processRegister(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {};
        if (response.headers && response.headers.forEach) {
            response.headers.forEach((v: any, k: any) => (_headers[k] = v));
        }
        if (status === 200) {
            return response.text().then((_responseText) => {
                return;
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400: any = null;
                result400 =
                    _responseText === ""
                        ? null
                        : <ErrorResponse>(
                              JSON.parse(_responseText, this.jsonParseReviver)
                          );
                return throwException(
                    "A server error occurred.",
                    status,
                    _responseText,
                    _headers,
                    result400
                );
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
        return Promise.resolve<void>(<any>null);
    }
    /**
     * Resend the email confirmation account to the given user account
     */
    resendConfirmationCode(
        model: ResendConfirmationModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/ResendConfirmation";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processResendConfirmationCode(_response);
        });
    }
    protected processResendConfirmationCode(
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
     * Confirm user account using code provided in mail
     * @model Model containing id and code
     * @return Success if successfully activated
     */
    confirmEmail(
        model: ConfirmationModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/ConfirmEmail";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processConfirmEmail(_response);
        });
    }
    protected processConfirmEmail(
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
     * Request password reset link
     */
    forgotPassword(
        model: ForgotPasswordViewModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/ForgotPassword";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processForgotPassword(_response);
        });
    }
    protected processForgotPassword(
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
     * Reset password confirmation
     */
    resetPassword(
        model: ResetPasswordViewModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/ResetPassword";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processResetPassword(_response);
        });
    }
    protected processResetPassword(
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
     * Create user accout for an external login
     */
    registerExternal(
        model: RegisterExternalBindingModel | null
    ): Promise<FileResponse | null> {
        let url_ = this.baseUrl + "/api/Account/RegisterExternal";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(model);
        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRegisterExternal(_response);
        });
    }
    protected processRegisterExternal(
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


export class FixedAccountClient extends AccountClient {
    constructor(
        baseUrl?: string,
        http?: {
            fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
        }
    ) {
        super(baseUrl, http);

        // Override exchange method to work around code generation issue
        this.exchange = ((
            loginRequest: LoginRequest | null | undefined
        ): Promise<LoginResponseModel> => {
            const {
                grant_type,
                password,
                username,
                scope,
                refresh_token,
            } = loginRequest;

            let url_ = this["baseUrl"] + "/api/Account/token?";
            let content_ = "";
            if (grant_type !== undefined) {
                content_ +=
                    "grant_type=" + encodeURIComponent("" + grant_type) + "&";
            }

            if (username !== undefined) {
                content_ +=
                    "username=" + encodeURIComponent("" + username) + "&";
            }

            if (password !== undefined) {
                content_ +=
                    "password=" + encodeURIComponent("" + password) + "&";
            }

            if (scope !== undefined) {
                content_ += "scope=" + encodeURIComponent("" + scope) + "&";
            }

            if (refresh_token !== undefined) {
                content_ +=
                    "refresh_token=" +
                    encodeURIComponent("" + refresh_token) +
                    "&";
            }

            let options_ = <RequestInit>{
                body: content_,
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json; charset=UTF-8",
                    "Sec-Fetch-Site": "cross-site",
                }),
            };

            return this["http"]
                .fetch(url_, options_)
                .then((response: Response) => {
                    return this.processExchange(response);
                });
        }) as any;
    }
}

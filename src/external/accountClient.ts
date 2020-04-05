import {
    AccountClient,
    LoginResponseModel,
    LoginRequest,
} from "./imperaClients";

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

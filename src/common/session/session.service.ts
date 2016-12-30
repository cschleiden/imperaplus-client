import { AccountClient, UserInfo } from "../../external/imperaClients";
import { getCachedClient, createClientWithToken } from "../../clients/clientFactory";

const scope = "openid offline_access";

export class SessionService {
    constructor(private _client: AccountClient) { }

    public refresh(refresh_token: string): Promise<{ access_token: string; refresh_token: string; }> {
        return this._client
            .exchange("refresh_token", undefined, undefined, scope, refresh_token)
            .then(result => {
                return {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token
                };
            });
    }
}
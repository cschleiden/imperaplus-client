import { IState } from "../reducers";

export type TokenProvider = () => string;

export function getTokenProvider(getState: () => IState): () => string {
    return () => getState().session?.access_token;
}

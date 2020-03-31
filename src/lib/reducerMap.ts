import { IAction } from "./action";

export default function reducerMap<TState>(
    action: IAction<any>,
    state: TState,
    map: { [key: string]: (state: TState, action: IAction<any>) => TState }
): TState {
    if (action && map.hasOwnProperty(action.type)) {
        return map[action.type](state, action);
    }

    return state;
}

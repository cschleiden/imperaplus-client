import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { setTitle } from "../domain/shared/general/general.slice";

export function useTitle(title: string) {
    const dispatch = useDispatch<AppDispatch>();
    dispatch(setTitle(title));
}

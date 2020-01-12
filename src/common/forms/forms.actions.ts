import { IAction } from "../../lib/action";

export const RESET_FORM = "reset-form";
export const resetForm = (form: string): IAction<string> => ({
    type: RESET_FORM,
    payload: form
});

export enum FormMode {
    Pending,
    Success,
    Failed
}

export const SUBMIT_FORM = "submit-form";
export interface ISubmitPayload {
    form: string;
    mode: FormMode;
}
export const submitForm = (
    form: string,
    mode: FormMode
): IAction<ISubmitPayload> => ({
    type: SUBMIT_FORM,
    payload: {
        form: form,
        mode: mode
    }
});

export const CHANGE_FIELD = "change-field";
export interface IChangeFieldPayload {
    form: string;
    field: string;
    value: string | number | boolean;
}
export const changeField = (
    form: string,
    field: string,
    value: string | number | boolean
): IAction<IChangeFieldPayload> => ({
    type: CHANGE_FIELD,
    payload: {
        form: form,
        field: field,
        value: value
    }
});

export const INITIAL_VALUE = "form-set-initial-value";
export interface IInitialValuePayload {
    form: string;
    field: string;
    value: string | number | boolean;
}
export const initialValue = (
    form: string,
    field: string,
    value: string | number | boolean
): IAction<IInitialValuePayload> => ({
    type: INITIAL_VALUE,
    payload: {
        form: form,
        field: field,
        value: value
    }
});

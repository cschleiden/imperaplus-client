import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../../../i18n/errorCodes";
import { IState } from "../../../../reducers";
import { AppDispatch, AppThunk, ThunkExtra } from "../../../../store";
import { MessageType, showMessage } from "../message/message.slice";
import { IFormState } from "./form";

export interface ISubmitInput {
    form: string;
    submitAction: any;
}

export interface IChangeFieldPayload {
    form: string;
    field: string;
    value: string | number | boolean;
}

export interface IInitialValuePayload {
    form: string;
    field: string;
    value: string | number | boolean;
}

export interface IForms {
    forms: {
        [key: string]: IForm;
    };
}

export interface IForm {
    name: string;

    fields: { [key: string]: IFieldValue };

    initialValues: { [key: string]: IFieldValue };

    /** Is form being submitted */
    isPending: boolean;
}

export interface IFieldValue {
    value: string | number | boolean | any;
}

export const doSubmit = (
    name: string,
    formState: IFormState,
    onSubmit: (
        formState: IFormState,
        dispatch: AppDispatch,
        getState: () => IState,
        extra: ThunkExtra
    ) => Promise<void>
): AppThunk => async (dispatch, getState, extra) => {
    try {
        dispatch(submitFormPending(name));

        await onSubmit(formState, dispatch, getState, extra);

        dispatch(submitFormSuccess(name));
    } catch (error) {
        // Dispatch generic message action
        let message = getErrorMessage(error.error);
        if (!message) {
            message = getErrorMessage(error.error_Description);
        }

        if (!message) {
            message = error.error_Description || error.error || error.message;
        }

        dispatch(
            showMessage({
                message,
                type: MessageType.error,
            })
        );

        dispatch(submitFormFailure(name));
    }
};

function ensureFormInitialized(state: IForms, form: string) {
    if (!state.forms[form]) {
        state.forms[form] = {
            isPending: false,
            name: form,
            fields: {},
            initialValues: {},
        };
    }
}

const slice = createSlice({
    name: "form",
    initialState: {
        forms: {},
    } as IForms,
    reducers: {
        resetForm: (state, action: PayloadAction<string>) => {
            ensureFormInitialized(state, action.payload);

            state.forms[action.payload] = {
                name: action.payload,
                isPending: false,
                fields: {
                    ...state.forms[action.payload]?.initialValues,
                },
                initialValues: state.forms[action.payload]?.initialValues || {},
            };
        },

        changeField: (state, action: PayloadAction<IChangeFieldPayload>) => {
            const { form, field, value } = action.payload;

            ensureFormInitialized(state, form);

            state.forms[form].fields[field] = { value };
        },
        initialValue: (state, action: PayloadAction<IInitialValuePayload>) => {
            const { form, field, value } = action.payload;

            ensureFormInitialized(state, form);

            state.forms[form].fields[field] = { value };
            state.forms[form].initialValues[field] = { value };
        },

        submitFormPending: (state, action: PayloadAction<string>) => {
            state.forms[action.payload].isPending = true;
        },
        submitFormSuccess: (state, action: PayloadAction<string>) => {
            state.forms[action.payload].isPending = false;
        },
        submitFormFailure: (state, action: PayloadAction<string>) => {
            state.forms[action.payload].isPending = false;
            state.forms[action.payload].fields = {
                ...(state.forms[action.payload] &&
                    state.forms[action.payload].initialValues),
            };
        },
    },
});

export const {
    resetForm,
    changeField,
    initialValue,
    submitFormFailure,
    submitFormPending,
    submitFormSuccess,
} = slice.actions;

export default slice.reducer;

import { IImmutable, makeImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { failed, IAction, pending, success } from "../../lib/action";
import * as FormActions from "./forms.actions";

export interface IForms {
    forms: {
        [key: string]: IForm;
    };
}

const test = 2;

export interface IForm {
    name: string;

    fields: { [key: string]: IField };

    /** Is form being submitted */
    isPending: boolean;
}

export interface IField {
    value: string | number | boolean;
}

const initialState = makeImmutable(<IForms>{
    forms: {}
});

const submitForm = (state: IImmutable<IForms>, action: IAction<FormActions.ISubmitPayload>) => {
    switch (action.payload.mode) {
        case FormActions.FormMode.Pending:
            return state.set(x => x.forms[action.payload.form].isPending, true);

        case FormActions.FormMode.Success:
            return state.set(x => x.forms[action.payload.form].isPending, false);

        case FormActions.FormMode.Failed:
            return state.set(x => x.forms[action.payload.form].isPending, false);
    }
};

const resetForm = (state: IImmutable<IForms>, action: IAction<string>) => {
    return state.set(x => x.forms[action.payload], {
        name: action.payload,
        fields: {}
    });
};

const changeField = (state: IImmutable<IForms>, action: IAction<FormActions.IChangeFieldPayload>) => {
    const payload = action.payload;

    return state.set(x => x.forms[payload.form].fields[payload.field], {
        value: payload.value
    });
};

export const forms = (
    state: IImmutable<IForms> = initialState,
    action?: any): IImmutable<IForms> => {

    return reducerMap(action, state, {
        [FormActions.SUBMIT_FORM]: submitForm,
        [FormActions.RESET_FORM]: resetForm,
        [FormActions.CHANGE_FIELD]: changeField
    });
};
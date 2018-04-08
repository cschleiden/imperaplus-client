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

    fields: { [key: string]: IFieldValue };

    initialValues: { [key: string]: IFieldValue };

    /** Is form being submitted */
    isPending: boolean;
}

export interface IFieldValue {
    value: string | number | boolean | any;
}

const initialState = makeImmutable(<IForms>{
    forms: {}
});

const submitForm = (state: IImmutable<IForms>, action: IAction<FormActions.ISubmitPayload>) => {
    switch (action.payload.mode) {
        case FormActions.FormMode.Pending:
            return state.__set(x => x.forms[action.payload.form].isPending, true);

        case FormActions.FormMode.Success:
            return state.__set(x => x.forms[action.payload.form], {
                isPending: false,
                fields: {
                    ...(state.forms[action.payload.form] && state.forms[action.payload.form].initialValues)
                }
            });

        case FormActions.FormMode.Failed:
            return state.__set(x => x.forms[action.payload.form].isPending, false);
    }
};

const resetForm = (state: IImmutable<IForms>, action: IAction<string>) => {
    return state.__set(x => x.forms[action.payload], {
        name: action.payload,
        fields: {
            ...(state.forms[action.payload] && state.forms[action.payload].initialValues)
        },
        isPending: false
    } as IForm);
};

const changeField = (state: IImmutable<IForms>, action: IAction<FormActions.IChangeFieldPayload>) => {
    const payload = action.payload;

    return state.__set(x => x.forms[payload.form].fields[payload.field], {
        value: payload.value
    });
};

const initialValue = (state: IImmutable<IForms>, action: IAction<FormActions.IInitialValuePayload>) => {
    const payload = action.payload;

    return state
        .__set(x => x.forms[payload.form].fields[payload.field], {
            value: payload.value
        })
        .__set(x => x.forms[payload.form].initialValues[payload.field], {
            value: payload.value
        });
};

export const forms = (
    state: IImmutable<IForms> = initialState,
    action?: any): IImmutable<IForms> => {

    return reducerMap(action, state, {
        [FormActions.SUBMIT_FORM]: submitForm,
        [FormActions.RESET_FORM]: resetForm,
        [FormActions.CHANGE_FIELD]: changeField,
        [FormActions.INITIAL_VALUE]: initialValue
    });
};
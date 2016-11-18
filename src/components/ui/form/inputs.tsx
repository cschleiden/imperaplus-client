import * as React from "react";

import { resetForm, changeField } from "../../../actions/forms";
import { IForms, IForm } from "../../../reducers/forms";

import { TextField, ITextFieldProps } from "office-ui-fabric-react/lib/TextField";
import { Checkbox, ICheckboxProps } from "office-ui-fabric-react/lib/Checkbox";

import { IFormContext, contextTypes } from "./form";

interface IControlledFieldProps {
    fieldName: string;
}

export const ControlledTextField = (props: ITextFieldProps & IControlledFieldProps, context: IFormContext) => {
    const currentValue = (): string =>
        context.formState
        && context.formState.fields
        && context.formState.fields[props.fieldName]
        && context.formState.fields[props.fieldName].value as string || "";

    return <TextField
        {...props as any}
        onChanged={(value) => {
            if (value !== currentValue()) {
                if (context.changeField) {
                    context.changeField(props.fieldName, value);
                }
            }
        } }
        value={currentValue()} />;
};

ControlledTextField["contextTypes"] = contextTypes;

export const ControlledCheckBox = (props: ICheckboxProps & IControlledFieldProps, context: IFormContext) => {
    const currentValue = (): boolean =>
        context.formState
        && context.formState.fields
        && context.formState.fields[props.fieldName]
        && context.formState.fields[props.fieldName].value as boolean || false;

    return <Checkbox
        {...props}
        onChange={(ev) => {
            const updatedValue = ev.currentTarget.checked;
            if (updatedValue !== currentValue()) {
                context.changeField(props.fieldName, updatedValue);
            }
        } }
        checked={currentValue()}
        />;
};


ControlledCheckBox["contextTypes"] = contextTypes;
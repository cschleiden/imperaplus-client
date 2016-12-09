import * as React from "react";

import { IFormState, FormState } from "./form";
import { resetForm, changeField } from "./forms.actions";
import { IForms, IForm } from "./forms.reducer";

import { TextField, ITextFieldProps } from "office-ui-fabric-react/lib/TextField";
import { Checkbox, ICheckboxProps } from "office-ui-fabric-react/lib/Checkbox";
import { Dropdown, IDropdownOption, IDropdownProps } from "office-ui-fabric-react/lib/Dropdown";

import { contextTypes, IFormContext } from "./types";

interface IControlledFieldProps {
    fieldName: string;

    validate?: (value: string, formState: IFormState) => string;
}

export class ControlledTextField extends React.Component<ITextFieldProps & IControlledFieldProps & { initialValue?: string }, void> {
    public context: IFormContext;

    public componentDidMount() {
        // Handle initial selection
        if (!this._currentValue() && this.props.initialValue) {
            this.context.changeField(this.props.fieldName, this.props.initialValue);
        }
    }

    public render() {
        return <TextField
            {...this.props as any}
            onBeforeChange={(value) => {
                if (value !== this._currentValue()) {
                    if (this.context.changeField) {
                        this.context.changeField(this.props.fieldName, value);
                    }
                }
            } }
            onGetErrorMessage={this.props.validate && ((value: string) => this.props.validate(value, new FormState(this.context.formState)))}
            value={this._currentValue()} />;
    }

    private _currentValue(): string {
        return this.context.formState
            && this.context.formState.fields
            && this.context.formState.fields[this.props.fieldName]
            && this.context.formState.fields[this.props.fieldName].value as string || "";
    }

    public static contextTypes = contextTypes;
}


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

export class ControlledDropdown extends React.Component<IDropdownProps & IControlledFieldProps, void> {
    public context: IFormContext;

    public componentDidMount() {
        // Handle initial selection
        if (!this._currentKey() && this.props.options) {
            let selectedElement = this.props.options.filter(x => x.selected);
            if (selectedElement && selectedElement.length > 0) {
                if (this._currentKey() !== selectedElement[0].key) {
                    this.context.changeField(this.props.fieldName, selectedElement[0].key);
                }
            }
        }
    }

    public render() {
        return <Dropdown
            {...this.props}
            onChanged={(option) => {
                if (option.key !== this._currentKey()) {
                    this.context.changeField(this.props.fieldName, option.key);
                }
            } }
            selectedKey={this._currentKey()}
            />;
    }

    private _currentKey(): string {
        return this.context.formState
            && this.context.formState.fields
            && this.context.formState.fields[this.props.fieldName]
            && this.context.formState.fields[this.props.fieldName].value as string || "";
    }

    public static contextTypes = contextTypes;
}
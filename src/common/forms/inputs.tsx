import * as React from "react";

import { IFormState, FormState } from "./form";
import { resetForm, changeField } from "./forms.actions";
import { IForms, IForm } from "./forms.reducer";

import { FormGroup, ControlLabel, FormControl, FormControlProps, Checkbox, CheckboxProps } from "react-bootstrap";

import { contextTypes, IFormContext } from "./types";

interface IControlledFieldProps {
    fieldName: string;

    validate?: (value: string, formState: IFormState) => string;
}

let id = 0;
const getId = () => {
    return `field-${++id}`;
};

export class ControlledTextField extends React.Component<FormControlProps & IControlledFieldProps & { initialValue?: string }, void> {
    private _id: string;

    public context: IFormContext;

    constructor(props, context) {
        super(props, context);

        this._id = getId();
    }

    public componentDidMount() {
        // Handle initial selection
        if (!this._currentValue() && this.props.initialValue) {
            this.context.changeField(this.props.fieldName, this.props.initialValue);
        }
    }

    public render() {
        return <FormGroup controlId={this._id}>
            <ControlLabel>{this.props.label}</ControlLabel>
            <FormControl
                {...this.props as any}
                id={this._id}
                onChange={(ev) => {
                    const inputElement = ev.target as HTMLInputElement;
                    const value = inputElement.value;

                    if (value !== this._currentValue()) {
                        if (this.context.changeField) {
                            this.context.changeField(this.props.fieldName, value);
                        }
                    }
                }}
                value={this._currentValue()} />
        </FormGroup>;
        // onGetErrorMessage={this.props.validate && ((value: string) => this.props.validate(value, new FormState(this.context.formState)))}
    }

    private _currentValue(): string {
        return this.context.formState
            && this.context.formState.fields
            && this.context.formState.fields[this.props.fieldName]
            && this.context.formState.fields[this.props.fieldName].value as string || "";
    }

    public static contextTypes = contextTypes;
}


export const ControlledCheckBox = (props: CheckboxProps & IControlledFieldProps, context: IFormContext) => {
    const currentValue = (): boolean =>
        context.formState
        && context.formState.fields
        && context.formState.fields[props.fieldName]
        && context.formState.fields[props.fieldName].value as boolean || false;

    return <Checkbox
        {...props}
        onChange={(ev: React.FormEvent<Checkbox>) => {
            const inputElement = ev.target as HTMLInputElement;
            const updatedValue = inputElement.value === "on";
            if (updatedValue !== currentValue()) {
                context.changeField(props.fieldName, updatedValue);
            }
        }}
        checked={currentValue()}>
        {props.label}
    </Checkbox>;
};

ControlledCheckBox["contextTypes"] = contextTypes;

export class ControlledDropdown extends React.Component<FormControlProps & IControlledFieldProps, void> {
    private _id: string;

    public context: IFormContext;

    constructor(props, context) {
        super(props, context);

        this._id = getId();
    }

    public componentDidMount() {
        // Handle initial selection
        if (this.props.value !== undefined) {
            this.context.changeField(this.props.fieldName, this.props.value as string | number);
        }
    }

    public render() {
        return <FormGroup controlId={this._id}>
            <ControlLabel>{this.props.label}</ControlLabel>
            <FormControl componentClass="select"
                {...this.props}
                onChange={(ev) => {
                    const inputElement = ev.target as HTMLSelectElement;
                    const value = inputElement.value;
                    if (this.props.fieldName === "map" && document.getElementById("mapPreview")) {
                        for (let i = 0; i < inputElement.length; i++) {
                            if (inputElement[i].value === value) {
                                document.getElementById("mapPreview").setAttribute("src", inputElement[i].attributes["data-map-url"].value);
                            }
                        }
                    }
                    this.context.changeField(this.props.fieldName, value);
                }}
                value={this._currentValue()}>
                {this.props.children}
            </FormControl>
        </FormGroup>;
    }

    private _currentValue(): string {
        return this.context.formState
            && this.context.formState.fields
            && this.context.formState.fields[this.props.fieldName]
            && this.context.formState.fields[this.props.fieldName].value as string || "";
    }

    public static contextTypes = contextTypes;
}
import * as React from "react";
import {
    Checkbox,
    CheckboxProps,
    ControlLabel,
    FormControl,
    FormControlProps,
    FormGroup,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { UserPicker } from "../../../../components/misc/userPicker";
import { UserReference } from "../../../../external/imperaClients";
import { FormContext, IFormContext, IFormState } from "./form";

function getId(fieldName: string): string {
    return `f-${fieldName}`;
}

interface IControlledFieldProps {
    fieldName: string;

    validate?: (value: string, formState: IFormState) => string;

    helpText?: JSX.Element;
}

export class ControlledTextField extends React.Component<
    FormControlProps & IControlledFieldProps & { initialValue?: string }
> {
    static contextType = FormContext;

    private _id: string;

    public context: IFormContext;

    constructor(props, context) {
        super(props, context);

        this._id = getId(props.fieldName);
    }

    public componentDidMount() {
        // Handle initial selection
        if (!this._currentValue() && this.props.initialValue) {
            this.context.initialValue(
                this.props.fieldName,
                this.props.initialValue
            );
        }
    }

    public render() {
        const {
            fieldName,
            helpText,
            label,
            validate,
            initialValue,
            ...remainingProps
        } = this.props;

        return (
            <FormGroup controlId={this._id}>
                {label && (
                    <ControlLabel htmlFor={this._id}>
                        {label}
                        {!!helpText && <div>test</div>}
                    </ControlLabel>
                )}
                <FormControl
                    disabled={this.context.isPending()}
                    name={fieldName}
                    {...remainingProps}
                    id={this._id}
                    onChange={(ev) => {
                        const inputElement = ev.target as HTMLInputElement;
                        const value = inputElement.value;

                        if (value !== this._currentValue()) {
                            if (this.context.changeField) {
                                this.context.changeField(fieldName, value);
                            }
                        }
                    }}
                    value={this._currentValue()}
                />
            </FormGroup>
        );
        // onGetErrorMessage={this.props.validate && ((value: string) => this.props.validate(value, new FormState(this.context.formState)))}
    }

    private _currentValue(): string {
        return (
            (this.context.formState &&
                this.context.formState.fields &&
                this.context.formState.fields[this.props.fieldName] &&
                (this.context.formState.fields[this.props.fieldName]
                    .value as string)) ||
            ""
        );
    }
}

export class ControlledUserPicker extends React.Component<
    FormControlProps & IControlledFieldProps & { initialValue?: UserReference }
> {
    static contextType = FormContext;

    private _id: string;

    public context: IFormContext;

    constructor(props, context) {
        super(props, context);

        this._id = getId(props.fieldName);
    }

    public componentDidMount() {
        // Handle initial selection
        if (!this._currentValue() && this.props.initialValue) {
            this.context.initialValue(
                this.props.fieldName,
                this.props.initialValue
            );
        }
    }

    public render() {
        const { fieldName, label, initialValue } = this.props;

        return (
            <FormGroup controlId={this._id}>
                {label && <ControlLabel>{label}</ControlLabel>}
                <UserPicker
                    name={fieldName}
                    onChange={(value) => {
                        if (value !== this._currentValue()) {
                            if (this.context.changeField) {
                                this.context.changeField(fieldName, value);
                            }
                        }
                    }}
                    initialValue={initialValue}
                />
            </FormGroup>
        );
    }

    private _currentValue(): UserReference {
        return (
            this.context.formState &&
            this.context.formState.fields &&
            this.context.formState.fields[this.props.fieldName] &&
            this.context.formState.fields[this.props.fieldName].value
        );
    }
}

export const ControlledCheckBox: React.FC<
    CheckboxProps & IControlledFieldProps
> = (props) => {
    const context = React.useContext(FormContext);

    const { fieldName, validate, label, ...remainingProps } = props;

    const currentValue = (): boolean =>
        (context.formState &&
            context.formState.fields &&
            context.formState.fields[fieldName] &&
            (context.formState.fields[fieldName].value as boolean)) ||
        false;

    return (
        <Checkbox
            {...remainingProps}
            onChange={(ev: React.FormEvent<Checkbox>) => {
                const inputElement = ev.target as HTMLInputElement;
                const updatedValue = inputElement.checked;
                if (updatedValue !== currentValue()) {
                    context.changeField(fieldName, updatedValue);
                }
            }}
            checked={currentValue()}
        >
            {label}
        </Checkbox>
    );
};

export class ControlledDropdown extends React.Component<
    FormControlProps & IControlledFieldProps
> {
    private _id: string;

    static contextType = FormContext;
    public context: IFormContext;

    constructor(props, context) {
        super(props, context);

        this._id = getId(props.fieldName);
    }

    public componentDidMount() {
        // Handle initial selection
        if (this.props.value !== undefined) {
            this.context.initialValue(
                this.props.fieldName,
                this.props.value as string | number
            );
        }
    }

    public render() {
        const { fieldName, label, children, helpText, ...remainingProps } =
            this.props;

        return (
            <FormGroup controlId={this._id}>
                {label && (
                    <div className="flex">
                        <div className="flex-1">
                            <ControlLabel>{label}</ControlLabel>
                        </div>
                        {!!helpText && (
                            <div className="align-center">
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip>{helpText}</Tooltip>}
                                >
                                    <div className="fa fa-info-circle" />
                                </OverlayTrigger>
                            </div>
                        )}
                    </div>
                )}
                <FormControl
                    componentClass="select"
                    {...remainingProps}
                    onChange={(ev) => {
                        const inputElement = ev.target as HTMLSelectElement;
                        const value = inputElement.value;

                        this.context.changeField(fieldName, value);
                    }}
                    value={this._currentValue()}
                >
                    {children}
                </FormControl>
            </FormGroup>
        );
    }

    private _currentValue(): string {
        return (
            (this.context.formState &&
                this.context.formState.fields &&
                this.context.formState.fields[this.props.fieldName] &&
                (this.context.formState.fields[this.props.fieldName]
                    .value as string)) ||
            ""
        );
    }
}

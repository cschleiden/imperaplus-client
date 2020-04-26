import * as React from "react";
import { FormGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { IState } from "../../../../reducers";
import { AppDispatch, ThunkExtra } from "../../../../store";
import {
    changeField,
    doSubmit,
    IForm,
    initialValue,
    resetForm,
} from "./forms.slice";

export interface IFormContext {
    formState: IForm;

    isPending(): boolean;
    changeField: (
        fieldName: string,
        value: string | number | boolean | Object
    ) => void;
    initialValue: (
        fieldName: string,
        value: string | number | boolean | Object
    ) => void;
}

export const FormContext = React.createContext<IFormContext>(
    {} as IFormContext
);

/** User provided input */
interface IFormProps {
    component: (props: {
        isPending: boolean;
        formState: IFormState;
        submit?: () => void;
    }) => JSX.Element;

    name: string;

    onSubmit?: (
        formState: IFormState,
        dispatch: AppDispatch,
        getState: () => IState,
        extra: ThunkExtra
    ) => Promise<void>;
}

interface IInternalFormProps {
    isPending: boolean;
    formState: IForm;

    submit: (formState: IFormState) => Promise<void>;
    reset: () => any;
    changeField: (fieldName: string, value: string | boolean | number) => any;
    initialValue: (fieldName: string, value: string | boolean | number) => any;
}

class Form extends React.Component<IFormProps & IInternalFormProps> {
    constructor(props: IFormProps & IInternalFormProps, context: any) {
        super(props, context);

        this.props.reset();
    }

    public componentWillUnmount() {
        this.props.reset();
    }

    public render() {
        let formState = new FormState(this.props.formState);

        return (
            <FormContext.Provider value={this.contextValue()}>
                <form onSubmit={this._onSubmit} action="#">
                    <FormGroup disabled={this.props.isPending}>
                        {this.props.component({
                            isPending: this.props.isPending,
                            formState: formState,
                            submit: this._submit,
                        })}
                    </FormGroup>
                </form>
            </FormContext.Provider>
        );
    }

    private _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        this._submit();

        e.preventDefault();
        return false;
    };

    private _submit = () => {
        this.props.submit(new FormState(this.props.formState));
    };

    private contextValue(): IFormContext {
        return {
            formState: this.props.formState,
            isPending: () => this.props.isPending,
            changeField: this.props.changeField,
            initialValue: this.props.initialValue,
        };
    }
}

export interface IFormState {
    getFieldValue<T>(key: string, defaultValue?: T);
}

export class FormState implements IFormState {
    constructor(public formState: IForm) {}

    getFieldValue<T>(key: string, defaultValue?: T) {
        const field = this.formState.fields[key];
        return (field && field.value) || defaultValue;
    }
}

export default connect(
    (state: IState, ownProps: IFormProps) => {
        return {
            formState:
                state.forms.forms[ownProps.name] ||
                ({
                    name: ownProps.name,
                    fields: {},
                } as IForm),
            isPending: state.forms.forms[ownProps.name]?.isPending || false,
        };
    },
    (dispatch: AppDispatch, ownProps: IFormProps) => ({
        submit: (formState: IFormState) => {
            dispatch(doSubmit(ownProps.name, formState, ownProps.onSubmit));
        },
        reset: () => dispatch(resetForm(ownProps.name)),
        changeField: (field: string, value: string | boolean | number) =>
            dispatch(
                changeField({
                    form: ownProps.name,
                    field,
                    value,
                })
            ),
        initialValue: (field: string, value: string | boolean | number) =>
            dispatch(
                initialValue({
                    form: ownProps.name,
                    field,
                    value,
                })
            ),
    })
)(Form);

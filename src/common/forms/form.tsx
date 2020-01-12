import { IImmutable } from "immuts";
import * as React from "react";
import { FormGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { IApiActionOptions, IThunkAction } from "../../lib/action";
import {
    initialValue,
    FormMode,
    resetForm,
    submitForm,
    changeField
} from "./forms.actions";
import { IForm, IForms } from "./forms.reducer";
import { contextTypes, IFormContext } from "./types";

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
        options: IApiActionOptions
    ) => IThunkAction;
    onSubmitSuccess?: <TResult>(result: TResult) => void;
    onSubmitFailed?: <TError>(error: TError) => void;
}

interface IInternalFormProps {
    isPending: boolean;
    formState: IForm;

    submit: (formState: IFormState) => IThunkAction;
    reset: () => any;
    changeField: (fieldName: string, value: string | boolean | number) => any;
    initialValue: (fieldName: string, value: string | boolean | number) => any;
}

class Form extends React.Component<IFormProps & IInternalFormProps> {
    public static childContextTypes = contextTypes;

    public getChildContext(): IFormContext {
        return {
            formState: this.props.formState,
            isPending: () => this.props.isPending,
            changeField: this.props.changeField,
            initialValue: this.props.initialValue
        };
    }

    public componentWillMount() {
        this.props.reset();
    }

    public componentWillUnmount() {
        this.props.reset();
    }

    public render() {
        let formState = new FormState(this.props.formState);

        return (
            <form onSubmit={this._onSubmit} action="#">
                <FormGroup disabled={this.props.isPending}>
                    {this.props.component({
                        isPending: this.props.isPending,
                        formState: formState,
                        submit: this._submit
                    })}
                </FormGroup>
            </form>
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
    (state: { forms: IImmutable<IForms> }, ownProps: IFormProps) => {
        return {
            formState:
                state.forms.forms[ownProps.name] ||
                ({
                    name: ownProps.name,
                    fields: {}
                } as IForm),
            isPending:
                (state.forms.forms[ownProps.name] &&
                    state.forms.forms[ownProps.name].isPending) ||
                false
        };
    },
    (dispatch, ownProps: IFormProps) => ({
        submit: (formState: IFormState) => {
            // Mark form as pending
            dispatch(submitForm(ownProps.name, FormMode.Pending));

            let submitAction = ownProps.onSubmit(formState, {
                beforeSuccess: d => {
                    d(submitForm(ownProps.name, FormMode.Success));
                },
                beforeError: d => d(submitForm(ownProps.name, FormMode.Failed))
            });

            if (!submitAction) {
                throw new Error("onSubmit has to return action");
            }

            dispatch(submitAction);
        },
        reset: () => dispatch(resetForm(ownProps.name)),
        changeField: (fieldName: string, value: string | boolean | number) =>
            dispatch(changeField(ownProps.name, fieldName, value)),
        initialValue: (fieldName: string, value: string | boolean | number) =>
            dispatch(initialValue(ownProps.name, fieldName, value))
    })
)(Form);

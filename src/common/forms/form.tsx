import { IImmutable } from "immuts";
import * as React from "react";
import { FormGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { IApiActionOptions, IPromiseAction, IThunkAction } from "../../lib/action";
import { changeField, FormMode, resetForm, submitForm } from "./forms.actions";
import { IForm, IForms } from "./forms.reducer";
import { contextTypes, IFormContext } from "./types";

/** User provided input */
interface IFormProps {
    component: (props: {
        isPending: boolean;
        formState: IFormState;
        submit: () => void;
    }) => JSX.Element;

    name: string;

    onSubmit?: <TResult, TInput>(formState: IFormState, options: IApiActionOptions) => IThunkAction;
    onSubmitSuccess?: <TResult>(result: TResult) => void;
    onSubmitFailed?: <TError>(error: TError) => void;
}

interface IInternalFormProps {
    isPending: boolean;
    formState: IForm;

    submit: <TResult, TInput>(formState: IFormState) => IThunkAction;
    reset: () => any;
    changeField: (fieldName: string, value: string | boolean | number) => any;
}

class Form extends React.Component<IFormProps & IInternalFormProps, void> {
    public static childContextTypes = contextTypes;

    public getChildContext(): IFormContext {
        return {
            formState: this.props.formState,
            isPending: () => this.props.isPending,
            changeField: this.props.changeField
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

        return <form onSubmit={this._onSubmit} action="#" disabled={this.props.isPending}>
            <FormGroup>
                {this.props.component({
                    isPending: this.props.isPending,
                    formState: formState,
                    submit: () => this.props.submit(formState)
                })}
            </FormGroup>
        </form>;
    }

    private _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        this.props.submit(new FormState(this.props.formState));

        e.preventDefault();
        return false;
    }
}

export interface IFormState {
    getFieldValue<T>(key: string, defaultValue?: T);
}

export class FormState implements IFormState {
    constructor(public formState: IForm) {
    }

    getFieldValue<T>(key: string, defaultValue?: T) {
        const field = this.formState.fields[key];
        return field && field.value || defaultValue;
    }
}

export default connect((state: { forms: IImmutable<IForms> }, ownProps: IFormProps) => {
    return {
        formState: state.forms.data.forms[ownProps.name] || {
            name: ownProps.name,
            fields: {}
        } as IForm,
        isPending: state.forms.data.forms[ownProps.name] && state.forms.data.forms[ownProps.name].isPending || false
    };
}, (dispatch, ownProps: IFormProps) => ({
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
    changeField: (fieldName: string, value: string | boolean | number) => dispatch(changeField(ownProps.name, fieldName, value))
}))(Form);
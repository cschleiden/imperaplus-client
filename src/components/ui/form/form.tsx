import * as React from "react";

import { connect } from "react-redux";
import { IImmutable } from "immuts";

import { submitForm, FormMode, resetForm, changeField } from "../../../actions/forms";
import { signup } from "../../../actions/session";
import { IForms, IForm } from "../../../reducers/forms";
import { contextTypes, IFormContext } from "./types";

/** User provided input */
interface IFormProps {
    component: (props: { 
        isPending: boolean;
        formState: IForm; 
        submit: () => void; }) => JSX.Element;

    name: string;

    onSubmit?: <TResult>(formState: IForm) => Promise<TResult>;
    onSubmitSuccess?: <TResult>(result: TResult) => void;
    onSubmitFailed?: () => void;
}

interface IInternalFormProps {
    isPending: boolean;
    formState: IForm;

    submit: (formState: IForm) => any;
    reset: () => any;
    changeField: (fieldName: string, value: string | boolean | number) => any;
}

class Form extends React.Component<IFormProps & IInternalFormProps, void> {
    public static childContextTypes = contextTypes;

    public getChildContext(): IFormContext {
        return {
            formState: this.props.formState,
            changeField: this.props.changeField
        };
    }

    public componentDidMount() {
        this.props.reset();
    }

    public render() {
        return <form onSubmit={this._onSubmit}>
            {this.props.component({
                isPending: this.props.isPending,
                formState: this.props.formState,
                submit: () => this.props.submit(this.props.formState)
            })}
        </form>;
    }

    private _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        this.props.submit(this.props.formState);

        e.preventDefault();
        return false;
    }
}

interface IOptions {
    name: string;

    onSubmit: <TResult>(formState: IForm) => Promise<TResult>;
    onSubmitSuccess?: <TResult>(result: TResult) => void;
    onSubmitFailed?: () => void;
}

export default connect((state: { forms: IImmutable<IForms> }, ownProps: IFormProps) => {
    console.log(ownProps.name + "own");
    return {
        formState: state.forms.data.forms[ownProps.name] || {
            name: ownProps.name,
            fields: {}
        } as IForm,
        isPending: state.forms.data.forms[ownProps.name] && state.forms.data.forms[ownProps.name].isPending || false
    };
}, (dispatch, ownProps: IFormProps) => ({
    submit: (formState: IForm) => {
        // Mark form as pending
        dispatch(submitForm(ownProps.name, FormMode.Pending));

        ownProps.onSubmit(formState).then((result) => {
            dispatch(submitForm(ownProps.name, FormMode.Success));

            if (ownProps.onSubmitSuccess) {
                ownProps.onSubmitSuccess(result);
            }
        }, () => {
            dispatch(submitForm(ownProps.name, FormMode.Failed));

            if (ownProps.onSubmitFailed) {
                ownProps.onSubmitFailed();
            }
        });
    },
    reset: () => dispatch(resetForm(ownProps.name)),
    changeField: (fieldName: string, value: string | boolean | number) => dispatch(changeField(ownProps.name, fieldName, value))
}))(Form);
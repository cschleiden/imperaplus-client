import * as React from "react";

import { connect } from "react-redux";
import { IImmutable } from "immuts";

import { submitForm, FormMode, resetForm, changeField } from "../../../actions/forms";
import { signup } from "../../../actions/session";
import { IForms, IForm } from "../../../reducers/forms";

export const contextTypes = {
    formState: React.PropTypes.object.isRequired,
    changeField: React.PropTypes.func.isRequired
};

export interface IFormContext {
    formState: IForm;

    changeField: (fieldName: string, value: string | number | boolean) => void;
}

export class Form extends React.Component<IInternalFormProps, void> {
    public static childContextTypes = contextTypes;

    public getChildContext(): IFormContext {
        return {
            formState: this.props.formState,
            changeField: this.props.changeField
        };
    }

    public render() {
        return <form onSubmit={this._onSubmit}>
            {this.props.children}
        </form>;
    }

    private _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        this.props.submit(this.props.formState);

        e.preventDefault();
        return false;
    }
}

export interface IFormProps {
    isPending: boolean;
    formState: IForm;

    submit: () => any;
    reset: () => any;
}

interface IInternalFormProps {
    isPending: boolean;
    formState: IForm;

    submit: (formState: IForm) => any;
    reset: () => any;
    changeField: (field: string, value: string) => any;
}

const wrapComponent = <TProps, TState>(Component: new (props: TProps) => React.Component<TProps & IFormProps, TState>): (props: TProps & IInternalFormProps) => JSX.Element => {
    return (props: TProps & IInternalFormProps): JSX.Element => {
        return <Form {...props}>
            <Component {...props} submit={() => props.submit(props.formState)} />
        </Form>
    };
};

export interface IOptions<TForm> {
    name: string;

    onSubmit: <TResult>(formState: IForm) => Promise<TResult>;
    onSubmitSuccess?: <TResult>(result: TResult) => void;
    onSubmitFailed?: () => void;
}

/*
interface IProps {
    form: IForm;
}

const mapStateToProps = (state: { forms: IImmutable<IForms> }) => ({
    form: state.forms.data.forms[formId]
}) as IProps;

interface IDispatch {
    resetForm: () => void;
    changeField: (field: string, value: string) => void;
    signup: () => void;
}

const mapDispatchToProps = (dispatch) => ({
    resetForm: () => dispatch(resetForm("signup")),
    changeField: (field: string, value: string) => dispatch(changeField("signup", field, value)),
    signup: () => dispatch(signup({
        username: "abc123",
        password: "P@assword",
        passwordConfirm: "P@ssword",
        email: "test@test.com"
    }))
}) as IDispatch;
*/

export function wrapForm<TForm>(options: IOptions<TForm>) {
    return <TProps, TState>(componentToWrap: new (props: TProps) => React.Component<IFormProps & TProps, TState>) => {
        return connect((state: { forms: IImmutable<IForms> }) => ({
            formState: state.forms.data.forms[options.name] || {} as IForm,
            isPending: state.forms.data.forms[options.name] && state.forms.data.forms[options.name].isPending || false
        }), (dispatch) => ({
            submit: (formState: IForm) => {
                // Mark form as pending
                dispatch(submitForm(options.name, FormMode.Pending));

                options.onSubmit(formState).then((result) => {
                    dispatch(submitForm(options.name, FormMode.Success));

                    options.onSubmitSuccess(result);
                }, () => {
                    dispatch(submitForm(options.name, FormMode.Failed));

                    options.onSubmitFailed();
                });
            },
            reset: () => dispatch(resetForm(options.name)),
            changeField: (field: string, value: string) => dispatch(changeField("signup", field, value))
        }))(wrapComponent<TProps, TState>(componentToWrap));
    };
}
import { IImmutable } from "immuts";
import * as React from "react";
import { FormGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { IPromiseAction } from "../../lib/action";
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

    onSubmit?: <TResult, TData>(formState: IFormState, options) => any; // Should be thunk action
    onSubmitSuccess?: <TResult>(result: TResult) => void;
    onSubmitFailed?: <TError>(error: TError) => void;
}

interface IInternalFormProps {
    isPending: boolean;
    formState: IForm;

    submit: (formState: IFormState) => any;
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

    constructor(props: IFormProps & IInternalFormProps, context: any) {
        super(props, context);

        this.props.reset();
    }

    public componentWillUnmount() {
        this.props.reset();
    }

    public render() {
        let formState = new FormState(this.props.formState);

        return <form onSubmit={this._onSubmit} action="#">
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
            beforeSuccess: d => d(submitForm(ownProps.name, FormMode.Success)),
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
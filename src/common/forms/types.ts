import * as React from "react";
import { IForms, IForm } from "./forms.reducer";

export const contextTypes = {
    formState: React.PropTypes.object.isRequired,
    changeField: React.PropTypes.func.isRequired
};

export interface IFormContext {
    formState: IForm;

    changeField: (fieldName: string, value: string | number | boolean) => void;
}
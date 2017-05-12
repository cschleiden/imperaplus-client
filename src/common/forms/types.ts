import * as React from "react";
import { IForm } from "./forms.reducer";

export const contextTypes = {
    formState: React.PropTypes.object.isRequired,
    isPending: React.PropTypes.func.isRequired,
    changeField: React.PropTypes.func.isRequired
};

export interface IFormContext {
    formState: IForm;

    isPending(): boolean;
    changeField: (fieldName: string, value: string | number | boolean | Object) => void;
}
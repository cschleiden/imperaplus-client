import { IForm } from "./forms.reducer";
import * as PropTypes from "prop-types";

export const contextTypes = {
    formState: PropTypes.object.isRequired,
    isPending: PropTypes.func.isRequired,
    changeField: PropTypes.func.isRequired,
    initialValue: PropTypes.func.isRequired,
};

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

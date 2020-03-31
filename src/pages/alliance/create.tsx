import * as React from "react";
import { connect } from "react-redux";
import Form, { IFormState } from "../../common/forms/form";
import { ControlledTextField } from "../../common/forms/inputs";
import { GridColumn } from "../../components/layout";
import { ProgressButton } from "../../components/ui/progressButton";
import LinkString from "../../components/ui/strLink";
import { AllianceCreationOptions } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { create } from "./alliances.actions";

export interface ICreateAllianceProps {
    create: (options: AllianceCreationOptions) => void;
}

export class CreateAllianceComponent extends React.Component<
    ICreateAllianceProps
> {
    public render(): JSX.Element {
        return (
            <GridColumn className="col-xs-12">
                <p>
                    <LinkString
                        link={__(
                            "Here you can create a new alliance. You also might want to [join](/game/alliances) an existing alliance."
                        )}
                    />
                </p>

                <Form
                    name="alliance-create"
                    onSubmit={(formState: IFormState, options) => {
                        return create(
                            {
                                name: formState.getFieldValue("name"),
                                description: formState.getFieldValue(
                                    "description"
                                ),
                            },
                            options
                        );
                    }}
                    component={({ isPending, submit, formState }) => (
                        <div>
                            <ControlledTextField
                                label={__("Name")}
                                placeholder={__("Name")}
                                fieldName="name"
                                required={true}
                            />

                            <ControlledTextField
                                label={__("Description")}
                                placeholder={__("Description")}
                                fieldName="description"
                                required={true}
                            />

                            <ProgressButton
                                type="submit"
                                bsStyle="primary"
                                disabled={!this._formValid(formState)}
                                isActive={isPending}
                            >
                                {__("Create")}
                            </ProgressButton>
                        </div>
                    )}
                />
            </GridColumn>
        );
    }

    private _formValid(formState: IFormState): boolean {
        return (
            formState.getFieldValue("name") &&
            formState.getFieldValue("description")
        );
    }
}

export default connect(
    (state: IState) => {
        return {};
    },
    (dispatch) => ({
        create: (options: AllianceCreationOptions) => {
            dispatch(create(options));
        },
    })
)(CreateAllianceComponent);

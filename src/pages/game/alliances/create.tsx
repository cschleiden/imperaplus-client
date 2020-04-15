import * as React from "react";
import { ProgressButton } from "../../../components/ui/progressButton";
import { LinkString } from "../../../components/ui/strLink";
import { AllianceCreationOptions } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { create } from "../../../lib/domain/game/alliances.slice";
import Form, { IFormState } from "../../../lib/domain/shared/forms/form";
import { ControlledTextField } from "../../../lib/domain/shared/forms/inputs";
import { AppNextPage } from "../../../store";

export interface ICreateAllianceProps {
    create: (options: AllianceCreationOptions) => void;
}

function _formValid(formState: IFormState): boolean {
    return (
        formState.getFieldValue("name") &&
        formState.getFieldValue("description")
    );
}

const CreateAlliance: AppNextPage = (props) => {
    return (
        <>
            <p>
                <LinkString
                    link={__(
                        "Here you can create a new alliance. You also might want to [join](/game/alliances) an existing alliance."
                    )}
                />
            </p>

            <Form
                name="alliance-create"
                onSubmit={async (formState, dispatch) => {
                    await dispatch(
                        create({
                            name: formState.getFieldValue("name"),
                            description: formState.getFieldValue("description"),
                        })
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
                            disabled={!_formValid(formState)}
                            isActive={isPending}
                        >
                            {__("Create")}
                        </ProgressButton>
                    </div>
                )}
            />
        </>
    );
};

CreateAlliance.getTitle = () => __("Create alliance");
CreateAlliance.needsLogin = true;

export default CreateAlliance;

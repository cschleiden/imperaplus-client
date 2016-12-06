import * as React from "react";

import { connect } from "react-redux";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section, SubSection } from "../../components/ui/typography";
import { ProgressButton } from "../../components/ui/progressButton";
import LinkString from "../../components/ui/strLink";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Pivot, PivotLinkSize, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";

import Form from "../../common/forms/form";
import { IForm } from "../../common/forms/forms.reducer";
import { ControlledCheckBox, ControlledTextField } from "../../common/forms/inputs";

export interface IMyGamesProps {
    refresh: () => void;
}

export class CreateGameComponent extends React.Component<IMyGamesProps, void> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        return <Grid>
            <GridRow>
                <GridColumn>
                    <Title>{__("Create Game")}</Title>
                </GridColumn>
            </GridRow>

            <GridRow>
                <GridColumn className="ms-u-lg9">
                    <LinkString link={__("Here you can create a new fun game. If you want to start playing sooner, you might want to [join](games/games/join) an existing game. Fun games do not count for the ladder.")} />

                    <Form
                        name="game-create"
                        component={(({ isPending, submit, formState }) => (
                            <Pivot linkSize={PivotLinkSize.large}>
                                <PivotItem linkText={__("Simple")}>
                                    <ControlledTextField
                                        label={__("Name")}
                                        placeholder={__("Name")}
                                        fieldName="name"
                                        required={true} />

                                    <ControlledTextField
                                        label={__("Password")}
                                        placeholder={__("Optional: Password")}
                                        type="password"
                                        fieldName="password"
                                        required={false} />

                                    <Dropdown
                                        label={__("Map")}
                                        />

                                    <Dropdown
                                        label={__("Timeout")}
                                        />

                                    <Dropdown
                                        label={__("Playes & Teams")}
                                        />
                                </PivotItem>

                                <PivotItem linkText={__("Advanced")}>
                                </PivotItem>
                            </Pivot>
                        ))} />


                    <ProgressButton buttonType={ButtonType.primary}>{__("Create")}</ProgressButton>
                </GridColumn>

                <GridColumn className="ms-u-lg3">
                    <Section>{__("Help")}</Section>
                    <p>
                        <LinkString link={__("Here you can create a new game. You can also [join](games/games/join) an existing game, which might be faster.")} />
                    </p>

                    <SubSection>{__("Simple")}</SubSection>
                    <p>
                        {__("Simple game settings group the most common settings, if you are not familiar with the other settings, just use the default values.")}
                    </p>

                    <SubSection>{__("Advanced")}</SubSection>
                    <p>
                        {__("These settings allow you to customize nearly every aspect of the created game.")}
                    </p>
                </GridColumn>
            </GridRow>
        </Grid>;
    }
}

export default connect(state => ({
}), (dispatch) => ({
}))(CreateGameComponent);
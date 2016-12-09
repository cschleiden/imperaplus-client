import * as React from "react";

import { connect } from "react-redux";
import { IState } from "../../reducers";

import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section, SubSection } from "../../components/ui/typography";
import { ProgressButton } from "../../components/ui/progressButton";
import LinkString from "../../components/ui/strLink";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Pivot, PivotLinkSize, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";

import Form, { IFormState } from "../../common/forms/form";
import { IForm } from "../../common/forms/forms.reducer";
import { ControlledCheckBox, ControlledTextField, ControlledDropdown } from "../../common/forms/inputs";

import { getMaps, create } from "./create.actions";
import { MapTemplateDescriptor, GameCreationOptions } from "../../external/imperaClients";

function getPlayerAndTeams() {
    let result: { key: string, text: string }[] = [];

    result.push({
        text: __("1 vs Bot"),
        key: "1bot"
    });

    const maxPlayersPerTeam = 16;
    const maxPlayers = 16;

    for (let playerPerTeam = 1; playerPerTeam <= maxPlayersPerTeam; ++playerPerTeam) {
        for (let teams = 2; playerPerTeam * teams <= maxPlayers; ++teams) {
            let labels = [];
            for (let i = 1; i <= playerPerTeam; ++i) {
                if (playerPerTeam === 1) {
                    labels.push("" + playerPerTeam * teams + " " + __("Players"));
                } else {
                    labels.push("" + teams);
                }
            }

            result.push({
                text: labels.join(" " + __("vs") + " "),
                key: teams + "t" + playerPerTeam
            });
        }
    }

    return result;
}

interface ICreateGameProps {
    getMaps: () => void;

    maps: MapTemplateDescriptor[];
}

export class CreateGameComponent extends React.Component<ICreateGameProps, void> {
    public componentDidMount() {
        if (!this.props.maps) {
            this.props.getMaps();
        }
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
                        onSubmit={(formState: IFormState, options) => {
                            const players = formState.getFieldValue("players");

                            let numTeams: number;
                            let numPlayers: number;
                            let addBot: boolean = false;

                            if (players.indexOf("bot") !== -1) {
                                // Bot play is restricted to 1vs1
                                numTeams = 2;
                                numPlayers = 1;
                                addBot = true;
                            } else if (players.indexOf("t") !== -1) {
                                numTeams = players.split("t")[0];
                                numPlayers = players.split("t")[1];
                            } else {
                                numPlayers = 1;
                                numTeams = parseInt(players, 10);
                            }

                            return create({
                                name: formState.getFieldValue("name"),
                                mapTemplate: formState.getFieldValue("map"),
                                numberOfPlayersPerTeam: numPlayers,
                                numberOfTeams: numTeams,
                                timeoutInSeconds: formState.getFieldValue("timeout"),
                                attacksPerTurn: formState.getFieldValue("attacks", 3),
                                movesPerTurn: formState.getFieldValue("moves", 3),
                                newUnitsPerTurn: formState.getFieldValue("unitsperturn", 3),
                                victoryConditions: [formState.getFieldValue("victoryConditions", 0)],
                                visibilityModifier: [formState.getFieldValue("visibilityModifier", 0)],
                                mapDistribution: formState.getFieldValue("distribution", 0),
                                initialCountryUnits: 1,
                                maximumNumberOfCards: 5,
                                minUnitsPerCountry: 1,
                                maximumTimeoutsPerPlayer: 3,
                                addBot: addBot
                            }, options);
                        } }
                        component={(({ isPending, submit, formState }) => (
                            <div>
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
                                            required={false}
                                            autoComplete="new-password" />

                                        <ControlledDropdown
                                            label={__("Map")}
                                            fieldName="map"
                                            options={this.props.maps && this.props.maps.map(m => ({
                                                key: m.name,
                                                text: m.name
                                            }))}
                                            />

                                        <ControlledDropdown
                                            label={__("Timeout")}
                                            fieldName="timeout"
                                            options={
                                                [
                                                    {
                                                        key: "300",
                                                        text: __("5 Minutes")
                                                    },
                                                    {
                                                        key: "600",
                                                        text: __("10 Minutes")
                                                    },
                                                    {
                                                        key: "18000",
                                                        text: __("5 Hours")
                                                    },
                                                    {
                                                        key: "36000",
                                                        text: __("10 Hours")
                                                    },
                                                    {
                                                        key: "86400",
                                                        text: __("1 Day")
                                                    },
                                                    {
                                                        key: "172800",
                                                        text: __("2 Days")
                                                    }
                                                ]
                                            }
                                            />

                                        <ControlledDropdown
                                            label={__("Players & Teams")}
                                            fieldName="players"
                                            options={getPlayerAndTeams()}
                                            />
                                    </PivotItem>

                                    <PivotItem linkText={__("Advanced")}>
                                        <ControlledTextField
                                            label={__("Attacks")}
                                            placeholder={__("Attacks")}
                                            type="number"
                                            fieldName="attacks"
                                            initialValue={"3"}
                                            required={false} />

                                        <ControlledTextField
                                            label={__("Moves")}
                                            placeholder={__("Moves")}
                                            type="number"
                                            fieldName="moves"
                                            initialValue={"3"}
                                            required={false} />

                                        <ControlledTextField
                                            label={__("Units per turn")}
                                            placeholder={__("Units per turn")}
                                            type="number"
                                            fieldName="unitsperturn"
                                            initialValue={"3"}
                                            required={false} />

                                        <ControlledDropdown
                                            label={__("Victory Condition")}
                                            fieldName="victoryCondition"
                                            options={[
                                                {
                                                    key: 0,
                                                    text: __("Survival"),
                                                    selected: true
                                                }
                                            ]}
                                            />

                                        <ControlledDropdown
                                            label={__("Visibility modifier")}
                                            fieldName="visibilityModifier"
                                            options={[
                                                {
                                                    key: 0,
                                                    text: __("Everything visible"),
                                                    selected: true
                                                }, {
                                                    key: 1,
                                                    text: __("Fog of War")
                                                }
                                            ]}
                                            />

                                        <ControlledDropdown
                                            label={__("Distribution")}
                                            fieldName="distribution"
                                            options={[
                                                {
                                                    key: 0,
                                                    text: __("Default"),
                                                    selected: true
                                                }, {
                                                    key: 1,
                                                    text: __("Malibu")
                                                }
                                            ]}
                                            />
                                    </PivotItem>
                                </Pivot>

                                <ProgressButton
                                    buttonType={ButtonType.primary}
                                    disabled={!this._formValid(formState)}
                                    isActive={isPending}>
                                    {__("Create")}
                                </ProgressButton>
                            </div>
                        ))} />
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

    private _formValid(formState: IFormState): boolean {
        return formState.getFieldValue("name")
            && formState.getFieldValue("timeout")
            && formState.getFieldValue("map");
    }
}

export default connect((state: IState) => ({
    maps: state.general.data.lookup["maps"]
}), (dispatch) => ({
    getMaps: () => { dispatch(getMaps(null)); }
}))(CreateGameComponent);
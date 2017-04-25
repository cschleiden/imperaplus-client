import * as React from "react";

import { connect } from "react-redux";
import { IState } from "../../reducers";

import { imageBaseUri } from "../../configuration";
import { GridRow, GridColumn } from "../../components/layout";
import { Title, Section, SubSection } from "../../components/ui/typography";
import { ProgressButton } from "../../components/ui/progressButton";
import LinkString from "../../components/ui/strLink";

import { Tabs, Tab, Image } from "react-bootstrap";

import Form, { IFormState } from "../../common/forms/form";
import { ControlledTextField, ControlledDropdown } from "../../common/forms/inputs";

import { getMaps, create } from "./create.actions";
import { MapTemplate } from "../../external/imperaClients";

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

    maps: MapTemplate[];
}

export class CreateGameComponent extends React.Component<ICreateGameProps, void> {
    public componentDidMount() {
        if (!this.props.maps) {
            this.props.getMaps();
        }
    }

    public render(): JSX.Element {
        return <GridColumn>
            <GridColumn className="col-md-8">
                <p>
                    <LinkString link={__("Here you can create a new fun game. If you want to start playing sooner, you might want to [join](/game/games/join) an existing game. Fun games do not count for the ladder.")} />
                </p>

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
                            initialCountryUnits: formState.getFieldValue("initialCountryUnits", 1),
                            maximumNumberOfCards: formState.getFieldValue("maximumNumberOfCards", 5),
                            minUnitsPerCountry: formState.getFieldValue("minUnitsPerCountry", 1),
                            maximumTimeoutsPerPlayer: formState.getFieldValue("maximumTimeoutsPerPlayer", 2),
                            addBot: addBot
                        }, options);
                    }}
                    component={(({ isPending, submit, formState }) => (
                        <div>
                            <Tabs defaultActiveKey={1}>
                                <Tab eventKey={1} title={__("Simple")}>
                                    <GridRow>
                                        <GridColumn className="col-md-6">
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
                                                value={""}>
                                                <option value=""></option>
                                                {this.props.maps && this.props.maps.map(m => <option value={m.name} data-map-url={`${imageBaseUri}${m.image}`}>{m.name}</option>)}
                                            </ControlledDropdown>

                                            <ControlledDropdown
                                                label={__("Timeout")}
                                                fieldName="timeout"
                                                value="86400">
                                                <option value="120">{__("2 Minutes")}</option>
                                                <option value="180">{__("3 Minutes")}</option>
                                                <option value="300">{__("5 Minutes")}</option>
                                                <option value="600">{__("10 Minutes")}</option>
                                                <option value="900">{__("15 Minutes")}</option>
                                                <option value="1800">{__("30 Minutes")}</option>
                                                <option value="2700">{__("45 Minutes")}</option>
                                                <option value="3600">{__("1 Hours")}</option>
                                                <option value="7200">{__("2 Hours")}</option>
                                                <option value="14400">{__("4 Hours")}</option>
                                                <option value="36000">{__("10 Hours")}</option>
                                                <option value="43200">{__("12 Hours")}</option>
                                                <option value="54000">{__("15 Hours")}</option>
                                                <option value="86400">{__("1 Day")}</option>
                                                <option value="172800">{__("2 Days")}</option>
                                                <option value="259200">{__("3 Days")}</option>
                                                <option value="432000">{__("5 Days")}</option>
                                                <option value="604800">{__("7 Days")}</option>
                                            </ControlledDropdown>

                                            <ControlledDropdown
                                                label={__("Players & Teams")}
                                                fieldName="players" value="1bot">
                                                {getPlayerAndTeams().map(x => <option value={x.key}>{x.text}</option>)}
                                            </ControlledDropdown>

                                        </GridColumn>
                                        <GridColumn className="col-md-6">
                                            <Image className="game-details-map" id="mapPreview" src="/assets/logo_150.png" responsive />
                                        </GridColumn>
                                    </GridRow>
                                </Tab>

                                <Tab eventKey={2} title={__("Advanced")}>
                                    <GridRow>
                                        <GridColumn className="col-md-6">
                                            <ControlledTextField
                                                label={__("Attacks")}
                                                placeholder={__("Attacks")}
                                                type="number"
                                                fieldName="attacks"
                                                initialValue={"5"}
                                                required={true} />

                                            <ControlledTextField
                                                label={__("Moves")}
                                                placeholder={__("Moves")}
                                                type="number"
                                                fieldName="moves"
                                                initialValue={"7"}
                                                required={true} />

                                            <ControlledTextField
                                                label={__("Units per turn")}
                                                placeholder={__("Units per turn")}
                                                type="number"
                                                fieldName="unitsperturn"
                                                initialValue={"3"}
                                                required={true} />

                                            <ControlledTextField
                                                label={__("initial country units")}
                                                placeholder={__("initial country units")}
                                                type="number"
                                                fieldName="initialCountryUnits"
                                                initialValue={"1"}
                                                required={true} />


                                            <ControlledTextField
                                                label={__("minimium units per country")}
                                                placeholder={__("minimium units per country")}
                                                type="number"
                                                fieldName="minUnitsPerCountry"
                                                initialValue={"1"}
                                                required={true} />

                                        </GridColumn>
                                        <GridColumn className="col-md-6">

                                            <ControlledTextField
                                                label={__("maximum number of cards")}
                                                placeholder={__("maximum number of cards")}
                                                type="number"
                                                fieldName="maximumNumberOfCards"
                                                initialValue={"5"}
                                                required={false} />


                                            <ControlledTextField
                                                label={__("maximum timeouts per player")}
                                                placeholder={__("maximum timeouts per player")}
                                                type="number"
                                                fieldName="maximumTimeoutsPerPlayer"
                                                initialValue={"2"}
                                                required={false} />

                                            <ControlledDropdown
                                                label={__("Victory Condition")}
                                                fieldName="victoryCondition" value={0}>
                                                <option value="0">{__("Survival")}</option>
                                                <option value="1">{__("Mission")}</option>
                                            </ControlledDropdown>

                                            <ControlledDropdown
                                                label={__("Visibility modifier")}
                                                fieldName="visibilityModifier" value={1}>
                                                <option value="0">{__("Everything visible")}</option>
                                                <option value="1">{__("Fog of War")}</option>
                                            </ControlledDropdown>

                                            <ControlledDropdown
                                                label={__("Distribution")}
                                                fieldName="distribution"
                                                value={1}>
                                                <option value="0">{__("Default")}</option>
                                                <option value="1">{__("Malibu")}</option>
                                            </ControlledDropdown>
                                        </GridColumn>
                                    </GridRow>
                                </Tab>
                            </Tabs>

                            <ProgressButton
                                type="submit"
                                bsStyle="primary"
                                disabled={!this._formValid(formState)}
                                isActive={isPending}>
                                {__("Create")}
                            </ProgressButton>
                        </div>
                    ))} />
            </GridColumn>

            <GridColumn className="col-md-4">
                <Section>{__("Help")}</Section>
                <p>
                    <LinkString link={__("Here you can create a new game. You can also [join](/game/games/join) an existing game, which might be faster.")} />
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
        </GridColumn>;
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

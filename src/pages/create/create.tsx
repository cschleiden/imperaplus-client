import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { GridColumn, GridRow } from "../../components/layout";
import { ProgressButton } from "../../components/ui/progressButton";
import LinkString from "../../components/ui/strLink";
import { Section, SubSection, Title } from "../../components/ui/typography";
import { imageBaseUri } from "../../configuration";
import { Image, Tab, Tabs } from "react-bootstrap";
import Form, { IFormState } from "../../common/forms/form";
import { ControlledDropdown, ControlledTextField } from "../../common/forms/inputs";
import { MapPreview } from "../../components/ui/games/mapPreview";
import {
    MapDistribution, MapTemplate, MapTemplateDescriptor, VictoryConditionType, VisibilityModifierType
} from "../../external/imperaClients";
import { create, getMaps } from "./create.actions";
import { Link } from "react-router";

function getPlayerAndTeams() {
    let result: { key: string, text: string }[] = [];

    result.push({
        text: __("1 vs Bot"),
        key: "1bot"
    });

    const maxPlayersPerTeam = 16;
    const maxPlayers = 16;

    // 2 vs 2 vs 2

    for (let playersPerTeam = 1; playersPerTeam <= maxPlayersPerTeam; ++playersPerTeam) {
        for (let teams = 2; playersPerTeam * teams <= maxPlayers; ++teams) {
            let labels = [];

            if (playersPerTeam === 1) {
                // FFA
                labels.push("" + playersPerTeam * teams + " " + __("Players"));
            } else {
                for (let i = 1; i <= teams; ++i) {
                    labels.push("" + playersPerTeam);
                }
            }

            result.push({
                text: labels.join(" " + __("vs") + " "),
                key: teams + "t" + playersPerTeam
            });
        }
    }

    return result;
}

interface ICreateGameProps {
    getMaps: () => void;

    getMap: () => MapTemplate;

    maps: MapTemplateDescriptor[];
}

export class CreateGameComponent extends React.Component<ICreateGameProps> {
    public componentDidMount() {
        if (!this.props.maps) {
            this.props.getMaps();
        }
    }

    public render(): JSX.Element {
        return (
            <GridRow>
                <GridColumn className="col-md-8">
                    <p>
                        <LinkString link={__("Here you can create a new fun game. If you want to start playing sooner, you might want to [join](/game/games/join) an existing game. Fun games do not count for the ladder.")} />
                    </p>

                    <Form
                        name="game-create"
                        onSubmit={(formState: IFormState, options) => {
                            const players = formState.getFieldValue("players");

                            let numTeams: number;
                            let numberOfPlayersPerTeam: number;
                            let addBot: boolean = false;

                            if (players.indexOf("bot") !== -1) {
                                // Bot play is restricted to 1vs1
                                numTeams = 2;
                                numberOfPlayersPerTeam = 1;
                                addBot = true;
                            } else if (players.indexOf("t") !== -1) {
                                numTeams = players.split("t")[0];
                                numberOfPlayersPerTeam = players.split("t")[1];
                            } else {
                                numberOfPlayersPerTeam = 1;
                                numTeams = parseInt(players, 10);
                            }

                            return create({
                                name: formState.getFieldValue("name"),
                                password: formState.getFieldValue("password"),
                                mapTemplate: formState.getFieldValue("map"),
                                numberOfPlayersPerTeam: numberOfPlayersPerTeam,
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
                        component={(({ isPending, submit, formState }) =>
                            (
                                <div>
                                    <Tabs defaultActiveKey={1} id="create">
                                        <Tab eventKey={1} title={__("Simple")}>
                                            <GridRow>
                                                <GridColumn className="col-xs-12 col-md-7">
                                                    <ControlledTextField
                                                        label={__("Name")}
                                                        placeholder={__("Name")}
                                                        fieldName="name"
                                                        required={true}
                                                    />

                                                    <ControlledTextField
                                                        label={__("Password")}
                                                        placeholder={__("Optional: Password")}
                                                        type="password"
                                                        fieldName="password"
                                                        required={false}
                                                        {...{ autoComplete: "new-password" } as any}
                                                    />

                                                    <ControlledDropdown
                                                        label={__("Map")}
                                                        fieldName="map"
                                                        value={""}>
                                                        <option value="" key="empty-map" />
                                                        {
                                                            this.props.maps && this.props.maps.map(m =>
                                                                <option key={m.name} value={m.name}>{m.name}</option>)
                                                        }
                                                    </ControlledDropdown>

                                                    <ControlledDropdown
                                                        label={__("Timeout")}
                                                        fieldName="timeout"
                                                        value="86400"
                                                    >
                                                        <option key="120" value="120">{__("2 Minutes")}</option>
                                                        <option key="180" value="180">{__("3 Minutes")}</option>
                                                        <option key="300" value="300">{__("5 Minutes")}</option>
                                                        <option key="600" value="600">{__("10 Minutes")}</option>
                                                        <option key="900" value="900">{__("15 Minutes")}</option>
                                                        <option key="1800" value="1800">{__("30 Minutes")}</option>
                                                        <option key="2700" value="2700">{__("45 Minutes")}</option>
                                                        <option key="3600" value="3600">{__("1 Hours")}</option>
                                                        <option key="7200" value="7200">{__("2 Hours")}</option>
                                                        <option key="14400" value="14400">{__("4 Hours")}</option>
                                                        <option key="36000" value="36000">{__("10 Hours")}</option>
                                                        <option key="43200" value="43200">{__("12 Hours")}</option>
                                                        <option key="54000" value="54000">{__("15 Hours")}</option>
                                                        <option key="86400" value="86400">{__("1 Day")}</option>
                                                        <option key="172800" value="172800">{__("2 Days")}</option>
                                                        <option key="259200" value="259200">{__("3 Days")}</option>
                                                        <option key="432000" value="432000">{__("5 Days")}</option>
                                                        <option key="604800" value="604800">{__("7 Days")}</option>
                                                    </ControlledDropdown>

                                                    <ControlledDropdown
                                                        label={__("Players & Teams")}
                                                        fieldName="players"
                                                        value="1bot"
                                                    >
                                                        {getPlayerAndTeams().map(x => <option key={x.key} value={x.key}>{x.text}</option>)}
                                                    </ControlledDropdown>

                                                </GridColumn>

                                                <GridColumn className="hidden-xs hidden-sm col-md-5">
                                                    {
                                                        formState.getFieldValue("map")
                                                        && <MapPreview
                                                            mapTemplateName={formState.getFieldValue("map")}
                                                            responsive={true}
                                                        />
                                                    }
                                                    {
                                                        formState.getFieldValue("map") &&
                                                        <Link to={`/game/mapPreview/${formState.getFieldValue("map")}`}>{__("Preview")}</Link>
                                                    }
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
                                                        min={1}
                                                        max={100}
                                                        required={true} />

                                                    <ControlledTextField
                                                        label={__("Moves")}
                                                        placeholder={__("Moves")}
                                                        type="number"
                                                        fieldName="moves"
                                                        initialValue={"7"}
                                                        min={1}
                                                        max={100}
                                                        required={true} />

                                                    <ControlledTextField
                                                        label={__("Units per turn")}
                                                        placeholder={__("Units per turn")}
                                                        type="number"
                                                        fieldName="unitsperturn"
                                                        initialValue={"3"}
                                                        min={1}
                                                        max={5}
                                                        required={true} />

                                                    <ControlledTextField
                                                        label={__("Initial country units")}
                                                        placeholder={__("Initial country units")}
                                                        type="number"
                                                        fieldName="initialCountryUnits"
                                                        initialValue={"1"}
                                                        min={0}
                                                        max={5}
                                                        required={true} />

                                                    <ControlledTextField
                                                        label={__("Minimum units per country")}
                                                        placeholder={__("Minimium units per country")}
                                                        type="number"
                                                        fieldName="minUnitsPerCountry"
                                                        initialValue={"1"}
                                                        required={true} />
                                                </GridColumn>

                                                <GridColumn className="col-md-6">
                                                    <ControlledTextField
                                                        label={__("Maximum number of cards")}
                                                        placeholder={__("Maximum number of cards")}
                                                        type="number"
                                                        fieldName="maximumNumberOfCards"
                                                        initialValue={"5"}
                                                        max={10}
                                                        required={false} />

                                                    <ControlledTextField
                                                        label={__("Maximum timeouts per player")}
                                                        placeholder={__("Maximum timeouts per player")}
                                                        type="number"
                                                        fieldName="maximumTimeoutsPerPlayer"
                                                        initialValue={"2"}
                                                        required={false} />

                                                    <ControlledDropdown
                                                        label={__("Victory Condition")}
                                                        fieldName="victoryCondition" value={VictoryConditionType.Survival}>
                                                        <option key={VictoryConditionType.Survival} value={VictoryConditionType.Survival}>{__("Survival")}</option>
                                                    </ControlledDropdown>

                                                    <ControlledDropdown
                                                        label={__("Visibility modifier")}
                                                        fieldName="visibilityModifier" value={VisibilityModifierType.None}>
                                                        <option key={VisibilityModifierType.None} value={VisibilityModifierType.None}>{__("Everything visible")}</option>
                                                        <option key={VisibilityModifierType.Fog} value={VisibilityModifierType.Fog}>{__("Fog of War")}</option>
                                                    </ControlledDropdown>

                                                    <ControlledDropdown
                                                        label={__("Distribution")}
                                                        fieldName="distribution"
                                                        value={MapDistribution.Default}>
                                                        <option key={MapDistribution.Default} value={MapDistribution.Default}>{__("Default")}</option>
                                                        <option key={MapDistribution.Malibu} value={MapDistribution.Malibu}>{__("Malibu")}</option>
                                                    </ControlledDropdown>
                                                </GridColumn>
                                            </GridRow>
                                        </Tab>
                                    </Tabs>

                                    <ProgressButton
                                        type="submit"
                                        bsStyle="primary"
                                        disabled={!this._formValid(formState)}
                                        isActive={isPending}
                                    >
                                        {__("Create")}
                                    </ProgressButton>
                                </div>
                            )
                        )}
                    />
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
            </GridRow>
        );
    }

    private _formValid(formState: IFormState): boolean {
        return formState.getFieldValue("name")
            && formState.getFieldValue("timeout")
            && formState.getFieldValue("map");
    }
}

export default connect((state: IState) => {
    const maps = state.general.data.lookup["maps"];

    return {
        maps: maps && maps.filter((m: MapTemplateDescriptor) => m.isActive)
    };
}, (dispatch) => ({
    getMaps: () => { dispatch(getMaps(null)); }
}))(CreateGameComponent);

import * as React from "react";

import "./gameList.scss";

import { GameSummary } from "../../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../../components/layout";
import HumanDate from "../humanDate";
import { Title, Section } from "../typography";
import { GameDetails } from "./gameDetail";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { DetailsList, SelectionMode, ConstrainMode, DetailsListLayoutMode, DetailsRow } from "office-ui-fabric-react/lib/DetailsList";

interface IGameListProps {
    games: GameSummary[];
}

interface IGameListState {
    expandedGames?: { [id: number]: boolean };
}

export class GameList extends React.Component<IGameListProps, IGameListState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expandedGames: {}
        };
    }

    public render() {
        return <DetailsList
            layoutMode={DetailsListLayoutMode.justified}
            constrainMode={ConstrainMode.horizontalConstrained}
            selectionMode={SelectionMode.none}
            onRenderRow={((props, defaultRender) => {
                let details: JSX.Element;
                if (this.state.expandedGames[props.item.id]) {
                    details = <GameDetails game={props.item} />;
                }

                return <div>
                    {defaultRender(props)}
                    {details}
                </div>;
            })}
            columns={[
                {
                    key: "id",
                    fieldName: "id",
                    name: __("#"),
                    minWidth: 40,
                    isCollapsable: true
                }, {
                    key: "name",
                    fieldName: "name",
                    name: __("Name"),
                    minWidth: 100
                }, {
                    key: "map",
                    fieldName: "mapTemplate",
                    name: __("Map"),
                    minWidth: 100,
                    isCollapsable: true
                }, {
                    key: "mode",
                    fieldName: "options.mapDistribution",
                    name: __("Mode"),
                    minWidth: 100,
                    onRender: (item) => item.options.mapDistribution,
                    isCollapsable: true
                }, {
                    key: "active",
                    fieldName: "active",
                    name: __("Active"),
                    minWidth: 50,
                    onRender: (item: GameSummary) => item.currentPlayer && item.currentPlayer.name
                }, {
                    key: "tp",
                    fieldName: null,
                    name: __("Teams/Players"),
                    minWidth: 100,
                    onRender: (item: GameSummary) => (`${item.options.numberOfTeams}/${item.options.numberOfPlayersPerTeam}`)
                }, {
                    key: "time",
                    fieldName: "time",
                    name: __("Time"),
                    minWidth: 75
                }, {
                    key: "state",
                    fieldName: "state",
                    name: __("State"),
                    minWidth: 50,
                    isCollapsable: true
                }, {
                    key: "actions",
                    fieldName: "actions",
                    name: "",
                    minWidth: 50,
                    onRender: (item: GameSummary) => {
                        return <Button
                            buttonType={ButtonType.icon}
                            icon="Info"
                            title={__("Show details")}
                            onClick={() => this._toggle(item.id)}></Button>;
                    }
                }
            ]}
            items={this.props.games || []}
            />;
    }

    private _toggle(id: number) {
        let update = Object.assign({}, this.state.expandedGames);

        if (this.state.expandedGames[id]) {
            delete update[id];
        } else {
            update[id] = true;
        }

        this.setState({
            expandedGames: update
        });
    }
}
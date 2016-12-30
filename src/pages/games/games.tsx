import * as React from "react";

import { connect } from "react-redux";
import { GameSummary } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import HumanDate from "../../components/ui/humanDate";
import { Title, Section } from "../../components/ui/typography";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { DetailsList, SelectionMode, ConstrainMode, DetailsListLayoutMode, DetailsRow } from "office-ui-fabric-react/lib/DetailsList";

import { IState } from "../../reducers";
import { refresh } from "./games.actions";

export interface IMyGamesProps {
    refresh: () => void;

    games: GameSummary[];
}

export class MyGamesComponent extends React.Component<IMyGamesProps, void> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        return <GridColumn className="ms-u-sm12">
            <Title>{__("My Games")}</Title>
            <div>
                <Section>{__("Fun")}</Section>
                <GameList games={this.props.games} />

                <Section>{__("Ranking")}</Section>

                <Section>{__("Tournament")}</Section>
            </div>
        </GridColumn>;
    }
}

interface IGameListProps {
    games: GameSummary[];
}

interface IGameListState {
    expandedGame?: number;
}

export class GameList extends React.Component<IGameListProps, IGameListState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expandedGame: null
        };
    }

    public render() {
        return <DetailsList
            layoutMode={DetailsListLayoutMode.justified}
            constrainMode={ConstrainMode.horizontalConstrained}
            selectionMode={SelectionMode.none}
            onRenderRow={((props, defaultRender) => {
                if (props.item.id === this.state.expandedGame) {
                    return <div style={{background: "red", height: "400px"}}>Details</div>;
                }

                return <DetailsRow {...props} />;
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
                        return <Button onClick={() => this._expand(item.id)}></Button>;
                    }
                }
            ]}
            items={this.props.games || []}
            />;
    }

    private _expand(id: number) {
        this.setState({
            expandedGame: id 
        });
    }
}

export default connect((state: IState) => ({
    games: state.games.data.games
}), (dispatch) => ({
    refresh: () => dispatch(refresh(null))
}))(MyGamesComponent);
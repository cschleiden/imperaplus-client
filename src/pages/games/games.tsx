import * as React from "react";

import { connect } from "react-redux";
import { GameSummary } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import HumanDate from "../../components/ui/humanDate";
import { Title, Section } from "../../components/ui/typography";

import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { DetailsList, SelectionMode, ConstrainMode, DetailsListLayoutMode } from "office-ui-fabric-react/lib/DetailsList";

// import { refresh } from "./.actions";

export interface IMyGamesProps {
    refresh: () => void;
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
                <GameList games={[]} />

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

}

export class GameList extends React.Component<IGameListProps, IGameListState> {
    public render() {
        return <DetailsList
            layoutMode={DetailsListLayoutMode.justified}
            constrainMode={ConstrainMode.horizontalConstrained}
            selectionMode={SelectionMode.none}
            columns={[
                {
                    key: "id",
                    fieldName: "id",
                    name: __("#"),
                    minWidth: 40
                }, {
                    key: "name",
                    fieldName: "name",
                    name: __("Name"),
                    minWidth: 100
                }, {
                    key: "map",
                    fieldName: "map",
                    name: __("Map"),
                    minWidth: 100
                }, {
                    key: "mode",
                    fieldName: "mode",
                    name: __("Mode"),
                    minWidth: 100
                }, {
                    key: "active",
                    fieldName: "active",
                    name: __("Active"),
                    minWidth: 50
                }, {
                    key: "tp",
                    fieldName: null,
                    name: __("Teams/Players"),
                    minWidth: 75,
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
                    minWidth: 50
                }, {
                    key: "actions",
                    fieldName: "actions",
                    name: "",
                    minWidth: 50
                }
            ]}
            items={this.props.games || []}
            />;
    }
}

export default connect(state => ({
}), (dispatch) => ({
}))(MyGamesComponent);
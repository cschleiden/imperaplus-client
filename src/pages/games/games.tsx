import * as React from "react";

import { connect } from "react-redux";
import { GameSummary } from "../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../components/layout";
import { Title, Section } from "../../components/ui/typography";
import { GameList } from "../../components/ui/games/gameList";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";

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
                <div className="pull-right">
                    <Button buttonType={ButtonType.primary} title={__("Refresh")}><i className="ms-Icon ms-Icon--Refresh" /></Button>
                    <Button buttonType={ButtonType.primary} title={__("Hide completed games")}><i className="ms-Icon ms-Icon--Hide2" /></Button>
                </div>

                <Section>{__("Fun")}</Section>
                <GameList games={this.props.games} />

                <Section>{__("Ranking")}</Section>

                <Section>{__("Tournament")}</Section>
            </div>
        </GridColumn>;
    }
}

export default connect((state: IState) => ({
    games: state.games.data.games
}), (dispatch) => ({
    refresh: () => dispatch(refresh(null))
}))(MyGamesComponent);
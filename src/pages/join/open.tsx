import * as React from "react";

import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { GameList } from "../../components/ui/games/gameList";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { refreshOpen } from "../games/games.actions";

export interface IFunGamesProps {
    refreshFun: () => void;

    funGames: GameSummary[];
    userId: string;
}

export class FunGamesComponent extends React.Component<IFunGamesProps> {
    public componentDidMount() {
        this.props.refreshFun();
    }

    public render(): JSX.Element {
        const { userId } = this.props;

        return (
            <GridColumn className="col-xs-12">
                <div>
                    <div className="pull-right">
                        <ButtonGroup>
                            <Button
                                key="refresh"
                                onClick={this.props.refreshFun}
                                title={__("Refresh")}>
                                <span className="glyphicon glyphicon-refresh" />
                            </Button>
                        </ButtonGroup>
                    </div>

                    <GameList
                        showCreatedBy={true}
                        showActive={false}
                        games={this.props.funGames}
                        userId={userId}
                        additionalColumns={{
                            "password": (game: GameSummary) => (
                                <span>
                                    {
                                        game.hasPassword && <i className="fa fa-lock" />
                                    }
                                </span>
                            )
                        }}
                        key="fun"
                    />
                </div>
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    const userInfo = state.session.data.userInfo;

    return {
        funGames: state.games.data.openGames,
        userId: userInfo && userInfo.userId
    };
}, (dispatch) => ({
    refreshFun: () => { dispatch(refreshOpen(null)); }
}))(FunGamesComponent);

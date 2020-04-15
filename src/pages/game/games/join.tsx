import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { GridColumn } from "../../../components/layout";
import { GameList } from "../../../components/ui/games/gameList";
import { GameSummary } from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { fetchOpen } from "../../../lib/domain/game/games.actions";
import { AppDispatch, AppNextPage } from "../../../store";

export interface IFunGamesProps {
    funGames: GameSummary[];
    userId: string;
}

const FunGames: AppNextPage<IFunGamesProps> = (props) => {
    const dispatch = useDispatch<AppDispatch>();

    const { userId } = props;

    return (
        <GridColumn className="col-xs-12">
            <div>
                <div className="pull-right">
                    <ButtonGroup>
                        <Button
                            key="refresh"
                            onClick={() => dispatch(fetchOpen())}
                            title={__("Refresh")}
                        >
                            <span className="glyphicon glyphicon-refresh" />
                        </Button>
                    </ButtonGroup>
                </div>

                <GameList
                    showCreatedBy={true}
                    showActive={false}
                    games={props.funGames}
                    userId={userId}
                    additionalColumns={{
                        password: (game: GameSummary) => (
                            <span>
                                {game.hasPassword && (
                                    <i className="fa fa-lock" />
                                )}
                            </span>
                        ),
                    }}
                    key="fun"
                />
            </div>
        </GridColumn>
    );
};

FunGames.needsLogin = true;
FunGames.getTitle = () => __("Join Fun Game");
FunGames.getInitialProps = async (ctx) => {
    await ctx.store.dispatch(fetchOpen());

    const state = ctx.store.getState();

    return {
        userId: state.session.userInfo.userId,
        funGames: state.games.openGames,
    };
};

export default FunGames;

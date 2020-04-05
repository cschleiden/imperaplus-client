import * as React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GridColumn, GridRow } from "../../../components/layout";
import { HumanDate, HumanTime } from "../../../components/ui/humanDate";
import {
    GameState,
    GameSummary,
    PlayerState,
    PlayerSummary,
} from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import {
    join,
    surrender,
    leave,
    remove,
    hide,
} from "../../../lib/domain/game/games.actions";
import Form, { IFormState } from "../../../lib/domain/shared/forms/form";
import { ControlledTextField } from "../../../lib/domain/shared/forms/inputs";
import { IState } from "../../../reducers";
import { AppDispatch } from "../../../store";
import { UserName } from "../userReference";
import style from "./gameDetail.module.scss";
import { MapPreview } from "./mapPreview";
import { PlayerOutcomeDisplay } from "./playerOutcome";

export interface IGameDetailsProps {
    game: GameSummary;
}

export interface IGameDetailsDispatchProps {
    hide: (gameId: number) => void;
    remove: (gameId: number) => void;
    surrender: (gameId: number) => void;
    leave: (gameId: number) => void;
}

const GameDetails: React.FC<IGameDetailsProps> = ({ game }) => {
    const { userId } = useSelector((s: IState) => ({
        userId: s.session.userInfo.userId,
    }));

    const player = _getPlayer(game, userId);

    const dispatch = useDispatch<AppDispatch>();

    return (
        <GridRow>
            <GridColumn className="col-md-6">
                <h2 className={style.gameDetailsName}>{game.name}</h2>

                <dl className="game-details">
                    <dt>{__("Started")}</dt>
                    <dd>{HumanDate(game.startedAt || game.lastActionAt)}</dd>

                    <dt>{__("Started By")}</dt>
                    <dd>{game.createdByName || "System"}</dd>

                    <dt>{__("Last action")}</dt>
                    <dd>{HumanDate(game.lastActionAt)}</dd>

                    <dt>{__("Turn")}</dt>
                    <dd>{game.turnCounter}</dd>

                    <dt>{__("Timeout")}</dt>
                    <dd>{HumanTime(game.options.timeoutInSeconds)}</dd>

                    <dt>{__("Mode")}</dt>
                    <dd>{game.options.mapDistribution}</dd>

                    <dt>
                        <span>{__("Attacks")}</span>/<span>{__("Moves")}</span>
                    </dt>
                    <dd>
                        {game.options.attacksPerTurn} /{" "}
                        {game.options.movesPerTurn}
                    </dd>

                    <dt>{__("Victory Conditions")}</dt>
                    <dd>{game.options.victoryConditions}</dd>

                    <dt>{__("Max bonus cards")}</dt>
                    <dd>{game.options.maximumNumberOfCards}</dd>

                    <dt>{__("Visibility Modifier")}</dt>
                    <dd>{game.options.visibilityModifier}</dd>

                    <br />

                    {_renderPlayers(game)}

                    <br />

                    <dt> {__("Actions")}</dt>
                    <dd>
                        {_canSurrender(game, player) && (
                            <Button
                                onClick={() => dispatch(surrender(game.id))}
                                bsStyle="warning"
                                bsSize="small"
                            >
                                <Glyphicon glyph="flag" />
                                &nbsp;{__("Surrender")}
                            </Button>
                        )}

                        {_canLeave(game, player) && (
                            <Button
                                onClick={() => dispatch(leave(game.id))}
                                bsStyle="warning"
                                bsSize="small"
                            >
                                <Glyphicon glyph="flag" />
                                &nbsp;{__("Leave game")}
                            </Button>
                        )}

                        {_canDelete(game, player) && (
                            <Button
                                onClick={() => dispatch(remove(game.id))}
                                bsStyle="danger"
                                bsSize="small"
                            >
                                <Glyphicon glyph="remove" />
                                &nbsp;{__("Delete game")}
                            </Button>
                        )}

                        {_canHide(game, player) && (
                            <Button
                                onClick={() => dispatch(hide(game.id))}
                                bsStyle="info"
                                bsSize="small"
                            >
                                <Glyphicon glyph="eye-close" />
                                &nbsp;{__("Hide finished game")}
                            </Button>
                        )}

                        {_canJoin(game, player) && (
                            <Form
                                name="join-game"
                                onSubmit={async (formState, dispatch) => {
                                    await dispatch(
                                        join({
                                            gameId: game.id,
                                            password:
                                                formState.getFieldValue(
                                                    "password"
                                                ) || undefined,
                                        })
                                    );
                                }}
                                component={({
                                    isPending,
                                    submit,
                                    formState,
                                }) => (
                                    <div>
                                        {game.hasPassword && (
                                            <ControlledTextField
                                                placeholder={__("Password")}
                                                type="password"
                                                fieldName="password"
                                                required={false}
                                                {...({
                                                    autoComplete:
                                                        "new-password",
                                                } as any)}
                                            />
                                        )}

                                        <Button
                                            disabled={
                                                !_formValid(game, formState) ||
                                                isPending
                                            }
                                            onClick={submit}
                                            bsStyle="primary"
                                            bsSize="small"
                                        >
                                            <Glyphicon glyph="plus-sign" />
                                            &nbsp;{__("Join game")}
                                        </Button>
                                    </div>
                                )}
                            />
                        )}
                    </dd>
                </dl>
            </GridColumn>

            <GridColumn className="col-md-6">
                <MapPreview mapTemplateName={game.mapTemplate} responsive />
            </GridColumn>
        </GridRow>
    );
};

function _renderPlayers(game: GameSummary): JSX.Element[] {
    const sortedTeams = game.teams
        .slice(0)
        .sort((a, b) => a.playOrder - b.playOrder);

    let result: JSX.Element[] = [];
    for (const team of sortedTeams) {
        result.push(
            <dt key={`dt-${team.id}`}>
                <span>{__("Team")}</span>&nbsp;{team.playOrder + 1}
            </dt>
        );
        result.push(
            <dd key={`dd-${team.id}`}>
                <ul className="list-unstyled">
                    {team.players.map(player => (
                        <li key={player.id}>
                            <PlayerOutcomeDisplay outcome={player.outcome} />
                            &nbsp;
                            <span
                                className={`label player player-${player.playOrder +
                                    1}`}
                            >
                                <UserName userName={player.name} />
                            </span>
                            &nbsp;-&nbsp;
                            <span>
                                {__("Timeouts")}: {player.timeouts}
                            </span>
                        </li>
                    ))}
                </ul>
            </dd>
        );
    }

    return result;
}

function _formValid(game: GameSummary, formState: IFormState): boolean {
    return !game.hasPassword || !!formState.getFieldValue("password");
}

function _canSurrender(game: GameSummary, player: PlayerSummary): boolean {
    return (
        player &&
        game.state === GameState.Active &&
        player.state === PlayerState.Active
    );
}

function _canLeave(game: GameSummary, player: PlayerSummary): boolean {
    return (
        player &&
        game.state === GameState.Open &&
        !!player &&
        game.createdByUserId !== player.userId
    );
}

function _canDelete(game: GameSummary, player: PlayerSummary): boolean {
    return (
        player &&
        game.state === GameState.Open &&
        !!player &&
        game.createdByUserId === player.userId
    );
}

function _canHide(game: GameSummary, player: PlayerSummary): boolean {
    return (
        (game.state === GameState.Active || game.state === GameState.Ended) &&
        player &&
        player.state === PlayerState.InActive
    );
}

function _canJoin(game: GameSummary, player: PlayerSummary): boolean {
    return (
        game.state === GameState.Open &&
        !player &&
        game.teams.reduce(
            (playerCount, team) => playerCount + team.players.length,
            0
        ) <
            game.options.numberOfPlayersPerTeam * game.options.numberOfTeams
    );
}

function _getPlayer(game: GameSummary, userId: string): PlayerSummary | null {
    for (let team of game.teams) {
        for (let player of team.players) {
            if (player.userId === userId) {
                return player;
            }
        }
    }

    return null;
}

export default GameDetails;

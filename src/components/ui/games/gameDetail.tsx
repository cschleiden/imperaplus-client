import * as React from "react";

import "./gameDetail.scss";

import { Button, Glyphicon, Image } from "react-bootstrap";
import { connect } from "react-redux";
import { getCachedClient } from "../../../clients/clientFactory";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { HumanDate, HumanTime } from "../../../components/ui/humanDate";
import { imageBaseUri } from "../../../configuration";
import { GameState, GameSummary, GameType, PlayerState, PlayerSummary } from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { hide, join, leave, remove, surrender } from "../../../pages/games/games.actions";
import { IState } from "../../../reducers";
import { store } from "../../../store";
import { UserName } from "../userReference";
import { MapPreview } from "./mapPreview";
import { PlayerOutcomeDisplay } from "./playerOutcome";
import Form, { IFormState } from "../../../common/forms/form";
import { ControlledTextField } from "../../../common/forms/inputs";

export interface IGameDetailsProps {
    game: GameSummary;
}

export interface IGameDetailsDispatchProps {
    hide: (gameId: number) => void;
    remove: (gameId: number) => void;
    surrender: (gameId: number) => void;
    leave: (gameId: number) => void;
}

class GameDetails extends React.Component<IGameDetailsProps & IGameDetailsDispatchProps> {
    public render() {
        const { game } = this.props;

        return (
            <GridRow>
                <GridColumn className="col-md-6">
                    <h2 className="game-details-name">{this.props.game.name}</h2>

                    <dl className="game-details">
                        <dt>{__("Started")}</dt>
                        <dd>
                            {HumanDate(this.props.game.startedAt || this.props.game.lastActionAt)}
                        </dd>

                        <dt>{__("Started By")}</dt>
                        <dd>{this.props.game.createdByName}</dd>

                        <dt>{__("Last action")}</dt>
                        <dd>{HumanDate(this.props.game.lastActionAt)}</dd>

                        <dt>{__("Turn")}</dt>
                        <dd>{this.props.game.turnCounter}</dd>

                        <dt>{__("Timeout")}</dt>
                        <dd>
                            {HumanTime(this.props.game.options.timeoutInSeconds)}
                        </dd>

                        <dt>{__("Mode")}</dt>
                        <dd>{this.props.game.options.mapDistribution}</dd>

                        <dt><span>{__("Attacks")}</span>/<span>{__("Moves")}</span></dt>
                        <dd>{this.props.game.options.attacksPerTurn} / {this.props.game.options.movesPerTurn}</dd>

                        <dt>{__("Victory Conditions")}</dt>
                        <dd>
                            {this.props.game.options.victoryConditions}
                        </dd>

                        <dt>{__("Max bonus cards")}</dt>
                        <dd>
                            {this.props.game.options.maximumNumberOfCards}
                        </dd>

                        <dt>{__("Visibility Modifier")}</dt>
                        <dd>
                            {this.props.game.options.visibilityModifier}
                        </dd>

                        <br />

                        {this._renderPlayer()}

                        <br />

                        <dt>{__("Actions")}</dt>
                        <dd>
                            {this._canSurrender() && <Button onClick={this._onSurrender} bsStyle="warning" bsSize="small">
                                <Glyphicon glyph="flag" />&nbsp;{__("Surrender")}
                            </Button>}

                            {this._canLeave() && <Button onClick={this._onLeave} bsStyle="warning" bsSize="small">
                                <Glyphicon glyph="flag" />&nbsp;{__("Leave game")}
                            </Button>}

                            {this._canDelete() && <Button onClick={this._onRemove} bsStyle="danger" bsSize="small">
                                <Glyphicon glyph="remove" />&nbsp;{__("Delete game")}
                            </Button>}

                            {this._canHide() && <Button onClick={this._onHide} bsStyle="info" bsSize="small">
                                <Glyphicon glyph="eye-close" />&nbsp;{__("Hide finished game")}
                            </Button>}

                            {
                                this._canJoin() && (
                                    <Form
                                        name="join-game"
                                        onSubmit={
                                            (formState: IFormState, options) => join({
                                                gameId: game.id,
                                                password: formState.getFieldValue("password") || undefined
                                            }, options)
                                        }
                                        component={
                                            ({ isPending, submit, formState }) =>
                                                (
                                                    <div>
                                                        {
                                                            game.hasPassword && (
                                                                <ControlledTextField
                                                                    placeholder={__("Password")}
                                                                    type="password"
                                                                    fieldName="password"
                                                                    required={false}
                                                                    {...{ autoComplete: "new-password" } as any}
                                                                />
                                                            )
                                                        }

                                                        <Button
                                                            disabled={!this._formValid(formState)}
                                                            onClick={submit}
                                                            bsStyle="primary"
                                                            bsSize="small">
                                                            <Glyphicon glyph="plus-sign" />&nbsp;{__("Join game")}
                                                        </Button>
                                                    </div>
                                                )}
                                    />
                                )
                            }
                        </dd>
                    </dl>
                </GridColumn>

                <GridColumn className="col-md-6">
                    <MapPreview mapTemplateName={this.props.game.mapTemplate} responsive />
                </GridColumn>
            </GridRow>
        );
    }

    private _renderPlayer(): JSX.Element[] {
        const sortedTeams = this.props.game.teams.slice(0).sort((a, b) => a.playOrder - b.playOrder);

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
                        {team.players.map(player => <li key={player.id}>
                            <PlayerOutcomeDisplay outcome={player.outcome} />&nbsp;<span className={`label player player-${player.playOrder + 1}`}><UserName userName={player.name} /></span>&nbsp;-&nbsp;<span>{__("Timeouts")}: {player.timeouts}</span>
                        </li>)}
                    </ul>
                </dd>
            );
        }

        return result;
    }

    private _formValid(formState: IFormState): boolean {
        const { game } = this.props;

        return !game.hasPassword || !!formState.getFieldValue("password");
    }

    private _canSurrender(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameState.Active && player.state === PlayerState.Active;
    }

    private _canLeave(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameState.Open && !!player && game.createdByUserId !== player.userId;
    }

    private _canDelete(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameState.Open && !!player && game.createdByUserId === player.userId;
    }

    private _canHide(): boolean {
        const { game } = this.props;
        const player = this._player();

        return (game.state === GameState.Active || game.state === GameState.Ended)
            && player && player.state === PlayerState.InActive;
    }

    private _canJoin(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameState.Open
            && !player
            && game.teams.reduce((playerCount, team) => playerCount + team.players.length, 0) < (game.options.numberOfPlayersPerTeam * game.options.numberOfTeams);
    }

    private _player(): PlayerSummary | null {
        for (let team of this.props.game.teams) {
            for (let player of team.players) {
                if (player.userId === store.getState().session.data.userInfo.userId) {
                    return player;
                }
            }
        }

        return null;
    }

    @autobind
    private _onSurrender() {
        this.props.surrender(this.props.game.id);
    }

    @autobind
    private _onLeave() {
        this.props.leave(this.props.game.id);
    }

    @autobind
    private _onHide() {
        this.props.hide(this.props.game.id);
    }

    @autobind
    private _onRemove() {
        this.props.remove(this.props.game.id);
    }
}

export default connect((state: IState, ownProps: IGameDetailsProps) => ownProps, (dispatch) => ({
    hide: (gameId: number) => { dispatch(hide(gameId)); },
    remove: (gameId: number) => { dispatch(remove(gameId)); },
    surrender: (gameId: number) => { dispatch(surrender(gameId)); },
    leave: (gameId: number) => { dispatch(leave(gameId)); },
}))(GameDetails);

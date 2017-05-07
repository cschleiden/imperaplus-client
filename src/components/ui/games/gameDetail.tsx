import * as React from "react";

import "./gameDetail.scss";

import { Button, Glyphicon, Image } from "react-bootstrap";
import { connect } from "react-redux";
import { getCachedClient } from "../../../clients/clientFactory";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import { HumanDate, HumanTime} from "../../../components/ui/humanDate";
import { imageBaseUri } from "../../../configuration";
import { GameState, GameSummary, GameType, MapClient, PlayerState, PlayerSummary } from "../../../external/imperaClients";
import { autobind } from "../../../lib/autobind";
import { hide, join, leave, remove, surrender } from "../../../pages/games/games.actions";
import { IState } from "../../../reducers";
import { store } from "../../../store";
import { PlayerOutcomeDisplay } from "./playerOutcome";

export interface IGameDetailsProps {
    game: GameSummary;
}

export interface IGameDetailsDispatchProps {
    hide: (gameId: number) => void;
    remove: (gameId: number) => void;
    surrender: (gameId: number) => void;
    leave: (gameId: number) => void;
    join: (gameId: number) => void;
}

export interface IGameDetailsState {
    imageSrc: string;
}

class GameDetails extends React.Component<IGameDetailsProps & IGameDetailsDispatchProps, IGameDetailsState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            imageSrc: null
        };
    }

    public componentDidMount() {
        getCachedClient(MapClient).getMapTemplate(this.props.game.mapTemplate).then(template => {
            this.setState({
                imageSrc: template.image
            });
        });
    }

    public render() {
        return <GridRow>
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

                        {this._canJoin() && <Button onClick={this._onJoin} bsStyle="primary" bsSize="small">
                            <Glyphicon glyph="plus-sign" />&nbsp;{__("Join game")}
                        </Button>}
                    </dd>
                </dl>
            </GridColumn>

            <GridColumn className="col-md-6">
                {this.state.imageSrc
                    && <Image className="game-details-map" src={`${imageBaseUri}${this.state.imageSrc}`} responsive />}
            </GridColumn>
        </GridRow>;
    }

    private _renderPlayer(): JSX.Element[] {
        const sortedTeams = this.props.game.teams.slice(0).sort((a, b) => a.playOrder - b.playOrder);

        let result: JSX.Element[] = [];
        for (let team of sortedTeams) {
            result.push(<dt key={`dt-${team.id}`}>
                <span>{__("Team")}</span>&nbsp;{team.playOrder + 1}
            </dt>);
            result.push(<dd key={`dd-${team.id}`}>
                <ul className="list-unstyled">
                    {team.players.map(player => <li key={player.id}>
                        <PlayerOutcomeDisplay outcome={player.outcome} />&nbsp;<span className={`label player player-${player.playOrder + 1}`}>{player.name}</span>&nbsp;-&nbsp;<span>{__("Timeouts")}: {player.timeouts}</span>
                    </li>)}
                </ul>
            </dd>);
        }

        return result;
    }

    private _canSurrender(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameState.Active && player.state === PlayerState.Active;
    }

    private _canLeave(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameState.Open && !!player;
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

    @autobind
    private _onJoin() {
        this.props.join(this.props.game.id);
    }
}

export default connect((state: IState, ownProps: IGameDetailsProps) => ownProps, (dispatch) => ({
    hide: (gameId: number) => dispatch(hide(gameId)),
    remove: (gameId: number) => dispatch(remove(gameId)),
    surrender: (gameId: number) => dispatch(surrender(gameId)),
    leave: (gameId: number) => dispatch(leave(gameId)),
    join: (gameId: number) => dispatch(join(gameId))
}))(GameDetails);
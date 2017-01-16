import * as React from "react";

import "./gameDetail.scss";

import { store } from "../../../store";
import { GameSummary, GameSummaryState, PlayerSummaryState, PlayerSummary, PlayerSummaryOutcome, PlayerOutcome } from "../../../external/imperaClients";
import { Grid, GridRow, GridColumn } from "../../../components/layout";
import HumanDate from "../../../components/ui/humanDate";
import { MapClient } from "../../../external/imperaClients";
import { getCachedClient } from "../../../clients/clientFactory";
import { imageBaseUri } from "../../../configuration";
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { autobind, css } from "office-ui-fabric-react/lib/utilities";
import { PlayerOutcomeDisplay } from "./playerOutcome";

interface IGameDetailsProps {
    game: GameSummary;
}

interface IGameDetailsState {
    imageSrc: string;
}

export class GameDetails extends React.Component<IGameDetailsProps, IGameDetailsState> {
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
        return <Grid>
            <GridRow>
                <GridColumn className="ms-u-md6">
                    <h2 className="game-details-name">{this.props.game.name}</h2>

                    <dl className="game-details">
                        <dt>{__("Started")}</dt>
                        <dd>
                            {HumanDate(this.props.game.startedAt)}
                        </dd>

                        <dt>{__("Started By")}</dt>
                        <dd>{this.props.game.createdByName}</dd>

                        <dt>{__("Last action")}</dt>
                        <dd>{HumanDate(this.props.game.lastActionAt)}</dd>

                        <dt>{__("Timeout")}</dt>
                        <dd>
                            {this.props.game.options.timeoutInSeconds}
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
                            {this._canSurrender() && <Button onClick={this._onSurrender}>{__("Surrender")}</Button>}

                            {/*                            <button ng-show="game.canSurrender"
                                class="btn-u btn-u-red btn-u-xs"
                                ng-click="game.surrender()"
                                title="{ 'Surrender' | translate }"><i class="fa fa-flag-o"></i>&nbsp;<span>Surrender</span></button>

                            <!-- Leave game (if state is Open) -->
                <button ng-click="game.leave()"
                                ng-show="game.canLeave"
                                class="btn-u btn-u-orange btn-u-xs"
                                title="{ 'Leave Game' | translate }">
                                <i class="fa fa-flag-o"></i>&nbsp;<span>Leave</span>
                            </button>

                            <!-- Delete game (if state is Open and player is creator) -->
                <button ng-click="game.delete()"
                                ng-show="game.canDelete"
                                class="btn-u btn-u-red btn-u-xs" title="{ 'Delete Game' | translate }">
                                <i class="fa fa-flag-o"></i>&nbsp;<span>Delete</span>
                            </button>

                            <!-- Hide game -->
                <button ng-show="game.canHide"
                                class="btn-u btn-u-light-grey btn-u-xs"
                                title="{ 'Hide finished game' | translate }"
                                ng-click="game.hide()">
                                <i class="fa fa-eye-slash"></i>&nbsp;<span>Hide</span>
                            </button>

                            <!-- Join game -->
                <button ng-hide="game.hasJoined"
                                class="btn-u btn-u-blue btn-u-xs"
                                title="{ 'Join game' | translate }"
                                ng-click="game.join()">
                                <i class="fa fa-plus-square"></i>&nbsp;<span>Join</span>
                            </button>*/}
                        </dd>
                    </dl>
                </GridColumn>

                <GridColumn className="ms-u-md6">
                    {this.state.imageSrc && <Image className="game-details-map" height={400} src={`${imageBaseUri}${this.state.imageSrc}`} imageFit={ImageFit.contain} />}
                </GridColumn>
            </GridRow>
        </Grid >;
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
                        <PlayerOutcomeDisplay outcome={player.outcome} />&nbsp;<span className={`player-${player.playOrder + 1}`}>{player.name}</span>&nbsp;-&nbsp;<span>{__("Timeouts")}: {player.timeouts}</span>
                    </li>)}
                </ul>
            </dd>);
        }

        return result;
    }

    private _canSurrender(): boolean {
        const { game } = this.props;
        const player = this._player();

        return game.state === GameSummaryState.Active && player.state === PlayerSummaryState.Active;
    }

    private _player(): PlayerSummary {
        for (let team of this.props.game.teams) {
            for (let player of team.players) {
                if (player.userId === store.getState().session.data.userInfo.userId) {
                    return player;
                }
            }
        }

        throw new Error("Logged in user not found in game");
    }

    @autobind
    private _onSurrender() {

    }
}

import * as React from "react";
import { Button, ButtonGroup, Glyphicon } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router";
import { GridColumn, GridRow } from "../../components/layout";
import { format } from "../../components/ui/format";
import { HumanTime } from "../../components/ui/humanDate";
import "../../components/ui/ladders.scss";
import { LadderSummary } from "../../external/imperaClients";
import { IState } from "../../reducers";
import { join, leave, refresh } from "./ladders.actions";
import "./ladders.scss";

export interface ILaddersProps {
    refresh: () => void;
    join: (ladderId: string) => void;
    leave: (ladderId: string) => void;

    ladders: LadderSummary[];
}

export class LaddersComponent extends React.Component<ILaddersProps> {
    public componentDidMount() {
        this.props.refresh();
    }

    public render(): JSX.Element {
        const ladders = this.props.ladders.map(ladder =>
            this._renderLadder(ladder)
        );

        return (
            <GridColumn className="col-xs-12">
                <GridRow>
                    <GridColumn className="col-xs-12 ladderList">
                        <div className="pull-right">
                            <ButtonGroup>
                                <Button
                                    key="refresh"
                                    onClick={this.props.refresh}
                                    title={__("Refresh")}
                                >
                                    <span className="glyphicon glyphicon-refresh" />
                                </Button>
                            </ButtonGroup>
                        </div>

                        <p>
                            {__(
                                "Here you can queue up for a new game in one of the available ladders. Games in ladders are automatically created once enough players have joined the queue."
                            )}
                        </p>
                    </GridColumn>
                </GridRow>

                <GridRow>{ladders}</GridRow>
            </GridColumn>
        );
    }

    private _renderLadder(ladder: LadderSummary): JSX.Element {
        const position = (ladder.standing && ladder.standing.position) || "-";
        const rating =
            (ladder.standing && Math.floor(ladder.standing.rating || 0)) || "-";
        const gamesPlayed =
            (ladder.standing && ladder.standing.gamesPlayed) || "-";
        const gamesWon = (ladder.standing && ladder.standing.gamesWon) || "-";
        const gamesLost = (ladder.standing && ladder.standing.gamesLost) || "-";

        const { options } = ladder;

        return (
            <GridColumn className="col-sm-6 col-md-4">
                <div className="vertical-box ladder">
                    <div className="vertical-box-header">
                        <h4>
                            <Link to={`/game/ladders/${ladder.id}`}>
                                {ladder.name}
                            </Link>
                        </h4>

                        {ladder.options.numberOfPlayersPerTeam === 1 && (
                            <h5>
                                {ladder.options.numberOfTeams}&nbsp;
                                {__("Players")}
                            </h5>
                        )}

                        {ladder.options.numberOfPlayersPerTeam > 1 && (
                            <h5>
                                {ladder.options.numberOfTeams}&nbsp;
                                {__("Teams")}&nbsp;{__("with")}&nbsp;
                                {ladder.options.numberOfPlayersPerTeam}&nbsp;
                                {__("Players each")}
                            </h5>
                        )}
                    </div>

                    <div className="vertical-box-content">
                        <dl className="dl-horizontal">
                            <dt>{__("Mode")}</dt>
                            <dd>{options.mapDistribution}</dd>

                            <dt>
                                {__("Attacks")} / {__("Moves")}
                            </dt>
                            <dd>
                                {options.attacksPerTurn} /{" "}
                                {options.movesPerTurn}
                            </dd>

                            <dt>{__("Victory Conditions")}</dt>
                            <dd>{options.victoryConditions}</dd>

                            <dt>{__("Visibility Modifier")}</dt>
                            <dd>{options.visibilityModifier}</dd>

                            <dt>{__("Timeout")}</dt>
                            <dd>{HumanTime(options.timeoutInSeconds)}</dd>
                        </dl>
                    </div>

                    <h5 className="vertical-box-header text-center">
                        {__("Standing")}
                    </h5>

                    <div className="vertical-box-content">
                        <dl className="dl-horizontal">
                            <dt>
                                <span>{__("Position | Rating")}</span>
                            </dt>
                            <dd>
                                {position} | {rating}
                            </dd>

                            <dt>
                                <span>{__("Games played")}</span>
                            </dt>
                            <dd>{gamesPlayed}</dd>

                            <dt>
                                <span>{__("Wins | Losses")}</span>
                            </dt>
                            <dd>
                                {gamesWon} | {gamesLost}
                            </dd>
                        </dl>
                    </div>

                    <h5 className="vertical-box-header text-center">
                        {ladder.queueCount > 1
                            ? format(
                                  __("{0} players in queue"),
                                  ladder.queueCount
                              )
                            : format(
                                  __("{0} player in queue"),
                                  ladder.queueCount
                              )}
                    </h5>

                    <h5 className="vertical-box-content">
                        {!ladder.isQueued && (
                            <Button
                                onClick={() => this._onJoin(ladder)}
                                bsStyle="primary"
                                bsSize="small"
                            >
                                <Glyphicon glyph="plus-sign" />
                                &nbsp;{__("Join queue")}
                            </Button>
                        )}

                        {ladder.isQueued && (
                            <div>
                                <p>{__("You are currently in the queue")}</p>
                                <Button
                                    onClick={() => this._onLeave(ladder)}
                                    bsStyle="warning"
                                    bsSize="small"
                                >
                                    <Glyphicon glyph="flag" />
                                    &nbsp;{__("Leave queue")}
                                </Button>
                            </div>
                        )}
                    </h5>
                </div>
            </GridColumn>
        );
    }

    private _onJoin(ladder: LadderSummary) {
        const ladderId = ladder.id;
        this.props.join(ladderId);
    }

    private _onLeave(ladder: LadderSummary) {
        const ladderId = ladder.id;
        this.props.leave(ladderId);
    }
}

export default connect(
    (state: IState) => {
        const gamesMap = state.ladders.ladders;
        const games = Object.keys(gamesMap).map(id => gamesMap[id]);

        return {
            ladders: games,
        };
    },
    dispatch => ({
        refresh: () => {
            dispatch(refresh(null));
        },
        join: (ladderId: string) => {
            dispatch(join(ladderId));
        },
        leave: (ladderId: string) => {
            dispatch(leave(ladderId));
        },
    })
)(LaddersComponent);

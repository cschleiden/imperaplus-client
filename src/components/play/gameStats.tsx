import * as React from "react";
import { Game, PlayerOutcome } from "../../external/imperaClients";
import __ from "../../i18n/i18n";
import { css } from "../../lib/utils/css";
import { PlayerOutcomeDisplay } from "../ui/games/playerOutcome";

export interface IGameStatsProps {
    game: Game;
}

export interface IStatPlayer {
    no: number;
    team: number;
    name: string;
    countries: number;
    units: number;
    outcome: PlayerOutcome;
}

export interface IGameStatsState {
    players: IStatPlayer[];

    isTeamGame: boolean;
}

export class GameStats extends React.Component<
    IGameStatsProps,
    IGameStatsState
> {
    constructor(props: IGameStatsProps, context) {
        super(props, context);

        this.state = this._getState(props);
    }

    componentWillReceiveProps(props: IGameStatsProps) {
        this.setState(this._getState(props));
    }

    render() {
        const { game } = this.props;
        const isTeamGame = game.options.numberOfPlayersPerTeam > 1;

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center" title={__("Player")}>
                                #
                            </th>
                            {isTeamGame && (
                                <th className="text-center" title={__("Team")}>
                                    {__("T")}
                                </th>
                            )}
                            <th title={__("Name")}>{__("Name")}</th>
                            <th className="text-center" title={__("Countries")}>
                                {__("C")}
                            </th>
                            <th className="text-center" title={__("Units")}>
                                {__("U")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.players.map((player) => (
                            <tr
                                className={css({
                                    "player-inactive":
                                        player.outcome !== PlayerOutcome.None,
                                })}
                                key={player.no}
                            >
                                <td className="text-center">
                                    {player.outcome === PlayerOutcome.None && (
                                        <span
                                            className={css(
                                                "label",
                                                "player",
                                                "player-" + (player.no + 1),
                                                {
                                                    ["player-team-" +
                                                    (player.team +
                                                        1)]: isTeamGame,
                                                }
                                            )}
                                        >
                                            {player.no + 1}
                                        </span>
                                    )}
                                    {player.outcome !== PlayerOutcome.None && (
                                        <PlayerOutcomeDisplay
                                            outcome={player.outcome}
                                        />
                                    )}
                                </td>
                                {isTeamGame && (
                                    <td className="text-center">
                                        <span
                                            className={css(
                                                "label",
                                                "team",
                                                `team-${player.team + 1}`
                                            )}
                                        >
                                            {player.team + 1}
                                        </span>
                                    </td>
                                )}
                                <td className="player-name">{player.name}</td>
                                <td className="text-center">
                                    {player.countries}
                                </td>
                                <td className="text-center">{player.units}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    private _getState(props: IGameStatsProps): IGameStatsState {
        const { game } = props;
        if (!game) {
            return {
                players: [],
                isTeamGame: false,
            };
        }

        const isTeamGame = game.options.numberOfPlayersPerTeam > 1;

        let players: IStatPlayer[] = [];

        if (game.teams) {
            for (let team of game.teams) {
                for (let player of team.players) {
                    players.push({
                        no: player.playOrder,
                        team: team.playOrder,
                        name: player.name,
                        countries: player.numberOfCountries || 0,
                        units: player.numberOfUnits || 0,
                        outcome: player.outcome,
                    });
                }
            }
        }

        players.sort((a: IStatPlayer, b: IStatPlayer) => {
            if (isTeamGame && a.team !== b.team) {
                // Sort by team first, then number
                return a.team - b.team;
            } else {
                return a.no - b.no;
            }
        });

        return {
            players,
            isTeamGame,
        };
    }
}

import * as React from "react";
import { PlayerOutcomeDisplay } from "../../../components/ui/games/playerOutcome";
import { Game, PlayerOutcome } from "../../../external/imperaClients";
import { css } from "../../../lib/css";

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

export class GameStats extends React.Component<IGameStatsProps, IGameStatsState> {
    constructor(props: IGameStatsProps, context) {
        super(props, context);

        this.state = this._getState(props);
    }

    componentWillReceiveProps(props: IGameStatsProps) {
        this.setState(this._getState(props));
    }

    render() {
        return <div>
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-center" title={__("Player")}>#</th>
                        <th title={__("Name")}>{__("Name")}</th>
                        <th className="text-center" title={__("Countries")}>{__("C")}</th>
                        <th className="text-center" title={__("Units")}>{__("U")}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.players.map(player =>
                        <tr className={css({
                            "player-inactive": player.outcome !== -1
                        })} key={player.no}>
                            <td className="text-center">
                                {player.outcome === PlayerOutcome.None && <span className={css("label", "player", "player-" + (player.no + 1))}>
                                    {(player.no + 1)}
                                </span>}
                                {player.outcome !== PlayerOutcome.None && <PlayerOutcomeDisplay outcome={player.outcome} />}
                            </td>
                            <td>
                                {player.name}
                            </td>
                            <td className="text-center">
                                {player.countries}
                            </td>
                            <td className="text-center">
                                {player.units}
                            </td>
                        </tr>)}
                </tbody>
            </table>
        </div>;
    }

    private _getState(props: IGameStatsProps): IGameStatsState {
        const { game } = props;
        const isTeamGame = game.options.numberOfPlayersPerTeam > 1;

        let numberOfTeams = 0;
        let numberOfPlayers = 0;

        let players: IStatPlayer[] = [];

        if (game.teams) {
            for (let team of game.teams) {
                ++numberOfTeams;

                for (let player of team.players) {
                    ++numberOfPlayers;

                    players.push({
                        no: player.playOrder,
                        team: team.playOrder,
                        name: player.name,
                        countries: player.numberOfCountries || 0,
                        units: player.numberOfUnits || 0,
                        outcome: player.outcome
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
            isTeamGame
        };
    }
}
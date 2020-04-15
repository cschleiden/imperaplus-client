import { Country, Game, Player, Team } from "../../../external/imperaClients";

export function countriesToMap(
    countries: Country[]
): { [id: string]: Country } {
    let idToCountry = {};

    if (countries && countries.length) {
        for (let country of countries) {
            idToCountry[country.identifier] = country;
        }
    }

    return idToCountry;
}

export function getPlayerFromTeams(teams: Team[], userId: string): Player {
    for (let team of teams) {
        for (let player of team.players) {
            if (player.userId === userId) {
                return player;
            }
        }
    }

    return null;
}

export function getPlayer(game: Game, userId: string): Player {
    return getPlayerFromTeams(game.teams, userId);
}

export function getPlayerFromTeamsByPlayerId(
    teams: Team[],
    playerId: string
): Player {
    for (let team of teams) {
        for (let player of team.players) {
            if (player.id === playerId) {
                return player;
            }
        }
    }

    return null;
}

export function getPlayerByPlayerId(game: Game, playerId: string): Player {
    return getPlayerFromTeamsByPlayerId(game.teams, playerId);
}

export function getTeam(game: Game, userId: string): Team {
    for (let team of game.teams) {
        for (let player of team.players) {
            if (player.userId === userId) {
                return team;
            }
        }
    }

    return null;
}

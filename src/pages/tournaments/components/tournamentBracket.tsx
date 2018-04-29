import * as d3type from "d3";
import { HierarchyPointNode } from "d3";
import * as React from "react";
import { Tournament, TournamentPairing } from "../../../external/imperaClients";
import { css } from "../../../lib/css";
import "./tournamentBracket.scss";

export interface ITournamentBracketProps {
    tournament: Tournament;

    navigateToPairing(id: string): void;
}

export interface ITournamentBracketState {
    pairings: IBracketPairing;
    width: number;
    height: number;
}

export interface IBracketPairing {
    id: string;

    numberOfGames: number;

    nameA: string;
    winsA: number;

    nameB: string;
    winsB: number;

    winner: string;

    children?: IBracketPairing[];
}

const widthPerPhase = 200;
const heightPerPairing = 50;
const separationConstant = 1;

export class TournamentBracket extends React.Component<ITournamentBracketProps, ITournamentBracketState> {
    private _element: HTMLElement;
    private _resolveElement = (element: HTMLElement) => this._element = element;

    constructor(props: ITournamentBracketProps) {
        super(props);

        this.state = this._getState(props);
    }


    public render() {
        return (
            <div className="tournament-bracket-container" ref={this._resolveElement}>
                <svg />
                <div className="labels" />
            </div>
        );
    }

    public componentDidMount() {
        require.ensure(["d3"], require => {
            // tslint:disable-next-line:no-require-imports
            const d3 = require("d3") as typeof d3type;

            const { pairings, width, height } = this.state;

            const line = d3.line<HierarchyPointNode<IBracketPairing>>()
                .x(d => width - d.y + (widthPerPhase / 2))
                .y(d => d.x - (heightPerPairing / 2) + 6)
                .curve(d3.curveStep);

            const treemap = d3
                .tree<IBracketPairing>()
                .size([height, width])
                .separation((a, b) => (a.parent === b.parent ? 1 : separationConstant));

            let nodes = treemap(d3.hierarchy(pairings));

            // Main drawing area
            const svg = d3
                .select(this._element.children[0])
                .attr("width", width)
                .attr("height", height);

            const g = svg
                .append("g");

            // adds the links between the nodes
            g
                .selectAll(".link")
                .data(nodes.descendants().slice(1))
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", d => line([d, d.parent]))
                .classed("win", d => !!d.data.winner);


            d3
                .select(this._element.querySelector(".labels"))
                .selectAll("div")
                .data(nodes.descendants())
                .enter()
                .append("div")
                .style("max-width", d => widthPerPhase + "px")
                .classed("table", true)
                .classed("played", d => !!d.data.winner)
                .style("left", d => width - d.y + "px")
                .style("top", d => (d.x - heightPerPairing) + "px")
                .html(d => this._gameTemplate(d))
                .on("click", (d) => {
                    if (d.data.id) {
                        this.props.navigateToPairing(d.data.id);
                    }
                });
        });
    }

    private _getState(props: ITournamentBracketProps): ITournamentBracketState {
        const { tournament } = props;
        let width: number;
        let height: number;

        let numberOfKoTeams = tournament.numberOfTeams;
        const hasGroupPhase = tournament.numberOfGroupGames > 0;
        if (hasGroupPhase) {
            const numberOfTeamsInGroup = 4;
            const winnersPerTeam = 2;
            numberOfKoTeams /= numberOfTeamsInGroup;
            numberOfKoTeams *= winnersPerTeam;
        }

        const numberOfRounds = Math.log(numberOfKoTeams) / Math.LN2;

        height = numberOfKoTeams * heightPerPairing;
        width = numberOfRounds * widthPerPhase;

        const root = {
            children: null as IBracketPairing[]
        };
        let parents = [root];

        for (let i = 0; i < numberOfRounds; ++i) {
            const phase = numberOfRounds - i - 1 + (hasGroupPhase ? 1 : 0);
            const pairings = tournament.pairings.filter(x => x.phase === phase);
            pairings.sort((a, b) => a.order - b.order);

            let newParents = [];
            const entryCount = Math.pow(2, i);
            for (let j = 0; j < entryCount; ++j) {
                const first = this._mapPairing(pairings, j * 2);
                const second = this._mapPairing(pairings, j * 2 + 1);

                parents[j].children = [first, second];

                newParents.push(first);
                newParents.push(second);
            }

            parents = newParents;
            newParents = [];
        }

        return {
            pairings: root.children[0],
            width,
            height
        };
    }

    private _gameTemplate(d: HierarchyPointNode<IBracketPairing>) {
        return `<div class="${css("tournament-row", {
            "winner": d.data.nameA === d.data.winner,
            "tbd": !d.data.nameA
        })}">
            <span class="tournament-cell name">${d.data.nameA || "&nbsp"}</span>
                        <span class="tournament-cell score">${d.data.winsA >= 0 ? d.data.winsA : ""}</span>
        </div>
                    <div class="${css(" tournament-row", {
                "winner": d.data.nameB === d.data.winner,
                "tbd": !d.data.nameB
            })}">
            <span class="tournament-cell name">${d.data.nameB || "&nbsp;"}</span>
                    <span class="tournament-cell score">${d.data.winsB >= 0 ? d.data.winsB : ""}</span>
        </div>`;
    }

    private _mapPairing(pairings: TournamentPairing[], index: number): IBracketPairing {
        const p = pairings[index];

        let winner;
        if (p) {
            if (p.teamAWon >= p.numberOfGames / 2) {
                winner = p.teamA.name;
            }

            if (p.teamBWon >= p.numberOfGames / 2) {
                winner = p.teamB.name;
            }
        }

        return {
            id: p && p.id,
            nameA: p && p.teamA.name || "",
            winsA: p && p.teamAWon,
            nameB: p && p.teamB.name || "",
            winsB: p && p.teamBWon,
            winner,
            numberOfGames: p && p.numberOfGames
        };
    }
}
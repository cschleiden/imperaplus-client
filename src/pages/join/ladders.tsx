import * as React from "react";

import "../../components/ui/ladders.scss";

import { connect } from "react-redux";
import { LadderSummary } from "../../external/imperaClients";
import { GridColumn } from "../../components/layout";
import { Title } from "../../components/ui/typography";
import { Glyphicon, Button, ButtonGroup } from "react-bootstrap";
import { autobind } from "../../lib/autobind";
import { HumanTime } from "../../components/ui/humanDate";
import { IState } from "../../reducers";
import { refresh, join } from "../games/ladders.actions";
import { setDocumentTitle } from "../../lib/title";

export interface ILaddersProps {
    refresh: () => void;
    join: (ladderId: string) => void;

    ladders: LadderSummary[];
}

export class LaddersComponent extends React.Component<ILaddersProps, void> {
    public componentDidMount() {
        this.props.refresh();

        setDocumentTitle(__("Join Ladder"));
    }

    public render(): JSX.Element {
        let ranking: JSX.Element[];

        const rows = this.props.ladders.map(ladder => this._renderLadder(ladder));

        /* if (this.props.ladders.length > 0) {
            ranking = [<Ladders ladders={this.props.ladders} key="ladder" />];
        } */

        return <GridColumn className="col-xs-12">
            <Title>{__("Join Ladder")}</Title>
            <div className="ladderList">
                <div className="pull-right">
                    <ButtonGroup>
                        <Button key="refresh" onClick={this.props.refresh} title={__("Refresh")}><span className="glyphicon glyphicon-refresh" /></Button>
                    </ButtonGroup>
                </div>
                <div className="col-xs-12">{__("Here you can queue up for a new game in one of the available ladders.")}</div>
                <GridColumn className="vertical-boxes col-xs-12">
                  {rows}
                </GridColumn>
            </div>
        </GridColumn>;
    }

    private _renderLadder(ladder: LadderSummary): JSX.Element[] {
        // let header: JSX.Element[];
        // header = <Link to={`/game/games/ladder/${ladder.id}`}>{ladder.name}</Link>;

        let position = ladder.standing ? ladder.standing.position : "-";
        let rating = ladder.standing ? ladder.standing.rating : "-";
        let gamesPlayed = ladder.standing ? ladder.standing.gamesPlayed : "-";
        let gamesWon = ladder.standing ? ladder.standing.gamesWon : "-";
        let gamesLost = ladder.standing ? ladder.standing.gamesLost : "-";
        let timer = HumanTime(ladder.options.timeoutInSeconds);

        return [<GridColumn className="col-xs-3 ladder vertical-box">
            <h4>{ladder.name}</h4>
            <h5>{ladder.options.numberOfTeams}</h5>
            <ul className="list-unstyled">
                <li className="hidden-xs">{__("Timeout")} {timer}</li>
                <li className="hidden-xs">{__("Mode")} {ladder.options.mapDistribution}</li>
                <li className="hidden-xs"><span>{__("Attacks")} | {__("Moves")}</span> <span>{ladder.options.movesPerTurn}</span></li>
                <li className="hidden-xs">{__("Victory Conditions")} {ladder.options.victoryConditions[0]}</li>
            </ul>
            <h5>{__("Standing")}</h5>
            <ul className="list-unstyled">
                <li className="hidden-xs"><span>{__("Position")} | {__("Rating")}</span> <span>{position} | {rating}</span></li>
                <li className="hidden-xs">{__("Games")} {gamesPlayed}</li>
                <li className="hidden-xs"><span>{__("Wins")} | {__("Losses")}</span> <span>{gamesWon} | {gamesLost}</span></li>
            </ul>
            <h5>
                <Button onClick={() => this._onJoin(ladder)} bsStyle="primary" bsSize="small">
                    <Glyphicon glyph="plus-sign" />&nbsp;{__("Join queue")}
                </Button>
            </h5>
        </GridColumn>];
    }

    @autobind
    private _onJoin(ladder) {
        let ladderId = ladder.id;
        this.props.join(ladderId);
    }
}

export default connect((state: IState) => {
    const gamesMap = state.ladders.data.ladders;
    const games = Object.keys(gamesMap).map(id => gamesMap[id]);

    return {
        ladders: games
    };
}, (dispatch) => ({
    refresh: () => dispatch(refresh(null)),
    join: (ladderId: string) => dispatch(join(ladderId))
}))(LaddersComponent);

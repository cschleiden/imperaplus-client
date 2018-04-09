import * as React from "react";
import { Button, ButtonGroup, Well } from "react-bootstrap";
import { connect } from "react-redux";
import { Grid, GridColumn, GridRow } from "../../components/layout";
import { Section, Title } from "../../components/ui/typography";
import { GameSummary, GameType, Alliance } from "../../external/imperaClients";

import { IState } from "../../reducers";
import { get } from "./alliances.actions";
import { setTitle } from "../../common/general/general.actions";

export interface IAllianceInfoProps {
    params?: {
        id: string;
    };

    setTitle: (title: string) => void;

    alliance: Alliance;

    get: (id: string) => void;
}

export class AllianceInfoComponent extends React.Component<IAllianceInfoProps> {
    componentWillMount() {
        this.props.get(this.props.params.id);
    }

    public componentDidUpdate() {
        const { alliance, setTitle } = this.props;

        if (alliance) {
            setTitle(__("Alliance") + ": " + alliance.name);
        }
    }

    render(): JSX.Element {
        const { alliance } = this.props;

        return (
            <GridColumn className="col-xs-12">
                {/* <Well>{alliance && alliance.description}</Well> */}

                <Section>Members</Section>
                <ul>
                    {alliance && alliance.members && alliance.members.map(member => (
                        <li key={member.id}>{member.name}</li>
                    ))}
                </ul>
            </GridColumn>
        );
    }
}

export default connect((state: IState) => {
    return {
        alliance: state.alliances.alliance
    };
}, (dispatch) => ({
    setTitle: (title: string) => { dispatch(setTitle(title)); },
    get: (id: string) => { dispatch(get(id)); }
}))(AllianceInfoComponent);
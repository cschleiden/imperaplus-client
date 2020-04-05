import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { GridColumn } from "../layout";
import { Title } from "./typography";

interface IBreadcrumbProps {
    location: {
        pathname: string;
    };
}

/* Breadcrumbs */
export class Breadcrumbs extends React.Component<IBreadcrumbProps> {
    public render(): JSX.Element {
        // TODO: This should come from the app
        let path = this.props.location.pathname.split("/");
        let locationArray = {
            games: __("My Games"),
            alliance: __("Alliance"),
            messages: __("Your messages"),
            profile: __("Your profile"),
            create:
                path[2] === "games"
                    ? __("Create Fun Game")
                    : __("Create alliance"),
            join:
                path[2] === "games" ? __("Join Fun Game") : __("Join alliance"),
            ladders: __("Ladders"),
            tournaments: __("Tournaments"),
            admin: __("Alliance Admin"),
            info: __("Information about alliances"),
        };

        let area: string = locationArray[path[2]];
        let page: string = locationArray[path[3]];
        let breadcrumb: JSX.Element;

        if (area) {
            breadcrumb = (
                <div className="container">
                    <div className="pull-left">
                        <Title>{page || area}</Title>
                    </div>
                    <div className="pull-right">
                        <ol className="breadcrumb">
                            {page && (
                                <li className="breadcrumb-item">{path[2]}</li>
                            )}
                            <li className="breadcrumb-item active">
                                <a href="javascript:void(0);">
                                    {path[3] || path[2]}
                                </a>
                            </li>
                        </ol>
                    </div>
                </div>
            );
        } else {
            breadcrumb = (
                <div className="container">
                    <div className="pull-left">
                        <Title>{__("News")}</Title>
                    </div>
                </div>
            );
        }

        return <GridColumn className="breadcrumbs">{breadcrumb}</GridColumn>;
    }
}

export default connect((state: IState) => ({
    location: state.router.locationBeforeTransitions,
}))(Breadcrumbs);

import * as React from "react";

import { GridColumn, GridRow } from "../components/layout";

import { AppNextPage } from "../store";
import { Slider } from "../components/ui/slider/slider";
import { Title } from "../components/ui/typography";
import __ from "../i18n/i18n";

const Home: AppNextPage = () => {
    const isIE11 =
        process.browser && navigator.userAgent.indexOf("Trident/7") > -1;
    if (isIE11) {
        return (
            <div className="text-center">
                <Title>{__("Warning: Outdated browser")}</Title>

                <p>
                    {__(
                        "Unfortunately we don't support your browser right now. Please use either Safari, Chrome, Firefox or Edge."
                    )}
                </p>
            </div>
        );
    }

    return (
        <div>
            <Slider
                background="/assets/slider/slider.gif"
                slides={[
                    {
                        headLines: [__("Conquer"), __("the world")],
                        bodyLines: [
                            __("Fight"),
                            __("on more than"),
                            __("80 maps"),
                        ],
                        img: "/assets/slider/map.png",
                    },
                    {
                        headLines: [__("Win in"), __("tournaments")],
                        bodyLines: [__("with hundreds"), __("of players")],
                        img: "/assets/slider/tournaments.png",
                    },
                    {
                        headLines: [__("Participate"), __("in"), __("leagues")],
                        bodyLines: [
                            __("Participate in different"),
                            __("leagues, alone or"),
                            __("in a team"),
                        ],
                        img: "/assets/slider/league.png",
                    },
                ]}
            />
            <h2 className="headline">
                {__("Impera allows you to conquer the world! Or many others.")}
            </h2>
            <GridRow>
                <GridColumn className="col-md-4">
                    <div className="feature">
                        <i className="fa fa-compress feature-icon" />
                        <div className="feature-desc">
                            <h4>
                                <span>{__("Many Different Maps")}</span>
                            </h4>
                            <p>
                                <span>
                                    {__(
                                        "Play on up to 80 different maps against opponents from all over the world..."
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                </GridColumn>
                <GridColumn className="col-md-4">
                    <div className="feature">
                        <i className="fa fa-cogs feature-icon" />
                        <div className="feature-desc">
                            <h4>
                                <span>{__("Great Community")}</span>
                            </h4>
                            <p>
                                <span>
                                    {__(
                                        "Tournaments, Leagues: Impera is not limited to simple one vs one games, it offers a wide variety of challenges"
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                </GridColumn>
                <GridColumn className="col-md-4">
                    <div className="feature">
                        <i className="fa fa-rocket feature-icon" />
                        <div className="feature-desc">
                            <h4>
                                <span>{__("Free As In Beer")}</span>
                            </h4>
                            <p>
                                <span>
                                    {__(
                                        `Impera is completely free, no hidden fees, no "in-app" purchases...`
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                </GridColumn>
            </GridRow>
        </div>
    );
};

Home.getTitle = () => "";

export default Home;

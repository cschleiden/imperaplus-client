import * as React from "react";
import * as CSSTransitionGroup from "react-addons-css-transition-group";

import "./slider.scss";

export interface ISlide {
    /** Background image */
    img: string;

    /** Lines of text */
    headLines: string[];

    /**  */
    bodyLines: string[];
}

export interface ISliderProps {
    background: string;

    slides: ISlide[];
}

export interface ISliderState {
    currentSlide: number;
}

export class Slider extends React.Component<ISliderProps, ISliderState> {
    constructor(props: ISliderProps, state: ISliderState) {
        super(props, state);

        this.state = {
            currentSlide: 0
        };
    }

    public render(): JSX.Element {
        return <div className="slider" style={{
            backgroundPosition: `${ this.state.currentSlide * 50 }% 0%`,
            backgroundImage: `url('${this.props.background}')`
        }}>
            <CSSTransitionGroup
                transitionName="slide"
                transitionEnterTimeout={600}
                transitionLeaveTimeout={600}>
                {this._renderSlide(this.props.slides[this.state.currentSlide])}
            </CSSTransitionGroup>
        </div>;
    }

    private _renderSlide(slide: ISlide) {
        return <div>
            <div className="headlines">
                {slide.headLines.map((l, i) => <h2><i key={i}>{l}</i></h2>)}
            </div>

            <div className="bodylines">
                {slide.bodyLines.map((l, i) => <h4><i key={i}>{l}</i></h4>)}
            </div>

            <div className="img">
                <img src={slide.img} />
            </div>
        </div>;
    }
}
import * as React from "react";
import styles from "./slider.module.scss";

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
            currentSlide: 0,
        };
    }

    public render(): JSX.Element {
        return (
            <div
                className={styles.slider}
                style={{
                    backgroundPosition: `${this.state.currentSlide * 50}% 0%`,
                    backgroundImage: `url('${this.props.background}')`,
                }}
            >
                {this._renderSlide(this.props.slides[this.state.currentSlide])}
            </div>
        );
    }

    private _renderSlide(slide: ISlide) {
        return (
            <div key={slide.img}>
                <div className={styles.img}>
                    <img src={slide.img} />
                </div>

                <div className={styles.headlines}>
                    {slide.headLines.map((l, i) => (
                        <h2 key={i}>
                            <i>{l}</i>
                        </h2>
                    ))}
                </div>

                <div className={styles.bodylines}>
                    {slide.bodyLines.map((l, i) => (
                        <h4 key={i}>
                            <i>{l}</i>
                        </h4>
                    ))}
                </div>
            </div>
        );
    }
}

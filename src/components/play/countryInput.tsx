import * as React from "react";
import { CountryTemplate } from "../../external/imperaClients";
import { css } from "../../lib/utils/css";
import style from "./countryInput.module.scss";

export interface ICountryInputFieldProps {
    countryTemplate: CountryTemplate;

    value: number;

    onChange: (value: number) => void;

    onKeyUp?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
}

export class CountryInputField extends React.Component<
    ICountryInputFieldProps
> {
    private _element: HTMLDivElement;
    private _resolveElement = (elem: HTMLDivElement) => {
        this._element = elem;
    };

    private _inputElement: HTMLInputElement;
    private _resolveInputElement = (elem: HTMLInputElement) => {
        this._inputElement = elem;
    };

    render() {
        const { countryTemplate, value, onKeyUp } = this.props;

        return (
            <div
                id={`p${countryTemplate.identifier}`}
                className={css(style.countryInput)}
                style={{
                    left: countryTemplate.x + 10,
                    top: countryTemplate.y + 3,
                }}
                ref={this._resolveElement}
            >
                <input
                    type="number"
                    min={1}
                    defaultValue={value.toString(10)}
                    onChange={this._onChange}
                    onFocus={this._onFocus}
                    onKeyUp={onKeyUp}
                    ref={this._resolveInputElement}
                />
            </div>
        );
    }

    componentDidMount() {
        this._element.classList.add(style.countryInputActive);

        this._inputElement.focus();
    }

    componentWillReceiveProps(props: ICountryInputFieldProps) {
        const newValue = props.value.toString(10);

        if (
            this._inputElement.value !== "" &&
            this._inputElement.value !== newValue
        ) {
            this._inputElement.value = newValue;
        }
    }

    private _onChange = (ev: React.FormEvent<HTMLInputElement>) => {
        const newValue = parseInt(this._inputElement.value, 10);

        if (!isNaN(newValue)) {
            this.props.onChange(newValue);
        }
    };

    private _onFocus = () => {
        this._inputElement.select();
    };
}

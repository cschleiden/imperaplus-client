import * as React from "react";
import { autobind } from "../../../lib/autobind";
import { css } from "../../../lib/css";
import { CountryTemplate } from "../../../external/imperaClients";

const KeyBindings = {
    "ABORT": 27, // Escape
    "SUBMIT_ACTION": 13 // Enter
};

export interface ICountryInputFieldProps {
    countryTemplate: CountryTemplate;
    value: number;
    onKeyUp: (event) => void;
    onChange: (value: number) => void;
}

export class CountryInputField extends React.Component<ICountryInputFieldProps, void> {
    private _element: HTMLDivElement;
    private _resolveElement = (elem: HTMLDivElement) => { this._element = elem; };

    private _inputElement: HTMLInputElement;
    private _resolveInputElement = (elem: HTMLInputElement) => { this._inputElement = elem; };

    render() {
        const { countryTemplate, value } = this.props;

        return <div
            id={`p${countryTemplate.identifier}`}
            className={css("input-country")}
            style={{
                left: countryTemplate.x + 10,
                top: countryTemplate.y + 3
            }}
            ref={this._resolveElement}>
            <input
                type="number"
                min={1}
                defaultValue={value.toString(10)}
                onKeyUp={this._onKeyUp}
                onChange={this._onChange}
                onFocus={this._onFocus}
                ref={this._resolveInputElement} />
        </div>;
    }

    componentDidMount() {
        this._element.classList.add("input-country-active");

        this._inputElement.focus();
    }

    componentWillReceiveProps(props: ICountryInputFieldProps) {
        const newValue = props.value.toString(10);

        if (this._inputElement.value !== "" && this._inputElement.value !== newValue) {
            this._inputElement.value = newValue;
        }
    }

    @autobind
    private _onChange(ev: React.FormEvent<HTMLInputElement>) {
        const newValue = parseInt(this._inputElement.value, 10);

        if (!isNaN(newValue)) {
            this.props.onChange(newValue);
        }
    }

    @autobind
    private _onKeyUp(ev: React.KeyboardEvent<HTMLInputElement>) {
        this.props.onKeyUp(ev);
    }

    @autobind
    private _onFocus() {
        this._inputElement.select();
    }
}

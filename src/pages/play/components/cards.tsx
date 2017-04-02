import * as React from "react";
import { css } from "../../../lib/css";
import { BonusCard } from "../../../external/imperaClients";

const colors = {
    [BonusCard.A]: "green",
    [BonusCard.B]: "red",
    [BonusCard.C]: "blue"
};

export interface ICardsProps {
    cards: BonusCard[];
}

export default (props: ICardsProps): JSX.Element => {
    const { cards } = props;
    let cardElements: JSX.Element[] = [];

    if (cards) {
        cards.sort();


        let addCardElement = (idx, count) => {
            cardElements.push(<span className={css("badge", "badge" + colors[idx])}>
                {count}
            </span>);
        };

        let currentElement: BonusCard = null;
        let currentElementCount: number = 0;

        for (let card of cards) {
            if (card !== currentElement) {
                if (currentElementCount > 0) {
                    addCardElement(currentElement, currentElementCount);
                }

                currentElementCount = 1;
                currentElement = card;
            } else {
                ++currentElementCount;
            }
        }

        if (currentElementCount > 0) {
            addCardElement(currentElement, currentElementCount);
        }
    }

    if (cardElements && cardElements.length) {
        return <span>
            {cardElements}
        </span>;
    }

    return <span>&nbsp;</span>;
};
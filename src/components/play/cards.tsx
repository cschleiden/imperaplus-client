import { BonusCard } from "../../external/imperaClients";
import { css } from "../../lib/utils/css";

const colors = {
    [BonusCard.A]: "green",
    [BonusCard.B]: "red",
    [BonusCard.C]: "blue",
};

export interface ICardsProps {
    cards: BonusCard[];
}

export default (props: ICardsProps): JSX.Element => {
    let { cards } = props;
    let cardElements: JSX.Element[] = [];

    cards = cards.slice(0);

    if (cards) {
        cards.sort();

        let addCardElement = (idx, count) => {
            cardElements.push(
                <span
                    key={colors[idx]}
                    className={css("badge", "badge-" + colors[idx])}
                >
                    {count}
                </span>
            );
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
        return <span>{cardElements}</span>;
    }

    return <span>&nbsp;</span>;
};

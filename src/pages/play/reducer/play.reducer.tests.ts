import { GameState, PlayState } from "../../../external/imperaClients";
import { UserProvider } from "../../../services/userProvider";
import * as Actions from "../play.actions";
import { play } from "./index";

UserProvider.userProvider = () => "user1";

describe("Play:reducer", () => {
    const state = play().__set((x) => x, {
        gameId: 1,
        game: {
            id: 1,
            state: GameState.Active,
            playState: PlayState.Attack,
            currentPlayer: {
                userId: "user1",
            },
        },
    } as any);

    describe("select country", () => {
        it("sets origin, then destination, then origin", () => {
            let s = state;

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: "a",
            });

            expect(s.twoCountry.originCountryIdentifier).toBe("a");
            expect(s.twoCountry.destinationCountryIdentifier).toBe(null);

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: "b",
            });

            expect(s.twoCountry.originCountryIdentifier).toBe("a");
            expect(s.twoCountry.destinationCountryIdentifier).toBe("b");

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: "c",
            });

            expect(s.twoCountry.originCountryIdentifier).toBe("c");
            expect(s.twoCountry.destinationCountryIdentifier).toBe("b");
        });

        it("resets when selecting null", () => {
            let s = state.__set((x) => x.twoCountry, {
                originCountryIdentifier: "a",
                destinationCountryIdentifier: "b",
                numberOfUnits: 42,
            });

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: null,
            });

            expect(s.twoCountry.originCountryIdentifier).toBe(null);
            expect(s.twoCountry.destinationCountryIdentifier).toBe(null);
        });

        it("selects countries only when allowed", () => {});
    });

    describe("place units", () => {});
});

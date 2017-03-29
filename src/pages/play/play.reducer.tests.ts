import { play, IPlayState } from "./play.reducer";
import * as Actions from "./play.actions";
import { UserProvider } from "../../services/userProvider";
import { Game, GameState, PlayState } from "../../external/imperaClients";

UserProvider.userProvider = () => "user1";

describe("Play:reducer", () => {
    const state = play().merge(x => x, {
        gameId: 1,
        game: {
            id: 1,
            state: GameState.Active,
            playState: PlayState.Attack,
            currentPlayer: {
                userId: "user1"
            }
        }
    } as any);

    describe("select_country", () => {
        it("sets origin, then destination, then origin", () => {
            let s = state;

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: "a"
            });

            expect(s.data.twoCountry.originCountryIdentifier).toBe("a");
            expect(s.data.twoCountry.destinationCountryIdentifier).toBe(null);

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: "b"
            });

            expect(s.data.twoCountry.originCountryIdentifier).toBe("a");
            expect(s.data.twoCountry.destinationCountryIdentifier).toBe("b");
            
            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: "c"
            });

            expect(s.data.twoCountry.originCountryIdentifier).toBe("c");
            expect(s.data.twoCountry.destinationCountryIdentifier).toBe("b");
        });

        it("resets when selecting null", () => {
            let s = state.set(x => x.twoCountry, {
                originCountryIdentifier: "a",
                destinationCountryIdentifier: "b",
                numberOfUnits: 42
            });

            s = play(s, {
                type: Actions.SELECT_COUNTRY,
                payload: null
            });

            expect(s.data.twoCountry.originCountryIdentifier).toBe(null);
            expect(s.data.twoCountry.destinationCountryIdentifier).toBe(null);
        });
    });
});
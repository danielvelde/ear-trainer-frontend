import { GameRequestProvider } from "../context/GameRequestContext.tsx";
import GameQuiz from "./GameQuiz.tsx";

function Game() {
    return (
        <div className="game">
            <GameRequestProvider>
                <GameQuiz />
            </GameRequestProvider>
        </div>
    );
}

export default Game;

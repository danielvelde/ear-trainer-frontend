import { GameRequestProvider } from "../context/GameRequestContext.tsx";
import GameRequestComponent from "./GameRequestComponent.tsx";

function GameComponent() {
    return (
        <div className="game">
            <GameRequestProvider>
                <GameRequestComponent />
            </GameRequestProvider>
        </div>
    );
}

export default GameComponent;

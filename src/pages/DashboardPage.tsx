import DashboardComponent from "../components/DashboardComponent.tsx";
import { GameRequestProvider } from "../context/GameRequestContext.tsx";

function DashboardPage() {
    return (
        <GameRequestProvider>
            <DashboardComponent />
        </GameRequestProvider>
    )
}

export default DashboardPage;
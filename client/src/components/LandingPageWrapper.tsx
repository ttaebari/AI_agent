import { AgenticaRpcProvider } from "../provider/AgenticaRpcProvider";
import { Landing } from "./Landing";

export function LandingPageWrapper() {
    return (
        <div className="not-first-of-type:p-4 flex gap-4 w-full">
            <AgenticaRpcProvider>
                <Landing />
            </AgenticaRpcProvider>
        </div>
    );
}

import { useState } from "react";
import { AgenticaRpcProvider } from "../provider/AgenticaRpcProvider";
import { Landing } from "./Landing";

export function LandingPageWrapper() {
    const [roomNumber, setRoomNumber] = useState(1);
    const user = "taeho";

    return (
        <div className="not-first-of-type:p-4 flex gap-4 w-full">
            <AgenticaRpcProvider user={user} roomNumber={roomNumber}>
                <Landing roomNumber={roomNumber} setRoomNumber={setRoomNumber} />
            </AgenticaRpcProvider>
        </div>
    );
}

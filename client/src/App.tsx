import { Chat } from "./components/chat/Chat";
import { LandingPageWrapper } from "./components/LandingPageWrapper";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";
import { useState } from "react";

const App = () => {
    const [roomNumber, setRoomNumber] = useState(1);
    const user = "taeho";
    const handleChangeRoomnumber = (roomNumber: number) => {
        setRoomNumber(roomNumber);
    };
    return (
        <div className="relative min-h-screen">
            {/* Shared Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-slate-900 to-neutral-900" />
            <div className="fixed inset-0 opacity-[0.07] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Content */}
            <div className="relative flex w-full min-h-screen">
                <div className="hidden lg:flex md:flex-1">
                    <LandingPageWrapper />
                </div>
                <AgenticaRpcProvider user={user} roomNumber={roomNumber}>
                    <Chat roomNumber={roomNumber} setRoomNumber={handleChangeRoomnumber} />
                </AgenticaRpcProvider>
            </div>
        </div>
    );
};

export default App;

import { Chat } from "./components/chat/Chat";
import { LandingPageWrapper } from "./components/LandingPageWrapper";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";
import { useState } from "react";

const App = () => {
    const [roomid, setRoomid] = useState(1);
    const user = "taeho";
    const handleChangeRoomid = (roomid: number) => {
        setRoomid(roomid);
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
                <AgenticaRpcProvider users={user} roomid={roomid}>
                    <Chat roomid={roomid} setRoomid={handleChangeRoomid} />
                </AgenticaRpcProvider>
            </div>
        </div>
    );
};

export default App;

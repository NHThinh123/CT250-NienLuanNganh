// contexts/chat.context.jsx
import { createContext, useState } from "react";

export const ChatContext = createContext({
    chatSessions: [],
    addChatSession: () => { },
    removeChatSession: () => { },
});

export const ChatWrapper = ({ children }) => {
    const [chatSessions, setChatSessions] = useState([]);

    const addChatSession = (userId, businessId, businessName, avatar) => {
        if (!userId || !businessId) {
            console.warn("userId hoặc businessId không hợp lệ!");
            return;
        }
        setChatSessions((prev) => {
            if (prev.some((session) => session.userId === userId && session.businessId === businessId)) {

                return prev;
            }
            const newSessions = [...prev, { userId, businessId, businessName, avatar }];

            return newSessions;
        });
    };

    const removeChatSession = (userId, businessId) => {
        setChatSessions((prev) =>
            prev.filter((session) => !(session.userId === userId && session.businessId === businessId))
        );
    };

    return (
        <ChatContext.Provider value={{ chatSessions, addChatSession, removeChatSession }}>
            {children}
        </ChatContext.Provider>
    );
};
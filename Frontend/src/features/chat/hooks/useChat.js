// features/chat/hooks/useChat.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
    fetchMessages,
    sendMessage,
    markMessageAsRead,
    fetchBusinessesForUser,
    fetchUsersForBusiness,
} from "../services/apiChat";
import { message } from "antd";

const useChat = (userId, businessId, onNewMessage) => {
    const queryClient = useQueryClient();
    const wsRef = useRef(null);

    const { data: messages, isLoading, error } = useQuery({
        queryKey: ["chat", userId, businessId],
        queryFn: () => fetchMessages({ userId, businessId }),
        enabled: !!userId && !!businessId,
        onSuccess: (data) => {
            console.log("Fetched messages:", data);
        },
    });

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: (newMessage) => {
            queryClient.setQueryData(["chat", userId, businessId], (old) => {
                const oldMessages = old || [];
                if (oldMessages.some((msg) => msg._id === newMessage._id)) {
                    return oldMessages;
                }

                return [...oldMessages, newMessage];
            });

        },
        onError: (error) => {
            message.error(error.message || "Gửi tin nhắn thất bại!");
        },
    });

    const markAsReadMutation = useMutation({
        mutationFn: markMessageAsRead,
        onSuccess: (updatedMessage) => {
            queryClient.setQueryData(["chat", userId, businessId], (old) =>
                old.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
            );
        },
    });

    useEffect(() => {
        if (!userId || !businessId) return;

        // Tạo WebSocket
        wsRef.current = new WebSocket("ws://localhost:8080");

        wsRef.current.onopen = () => {
            console.log("WebSocket connected");
            wsRef.current.send(JSON.stringify({ id: userId || businessId }));
        };

        wsRef.current.onmessage = (event) => {
            console.log("Received message:", event.data);
            const { event: eventType, data } = JSON.parse(event.data);
            if (eventType === "receiveMessage") {
                queryClient.setQueryData(["chat", userId, businessId], (old) => {
                    const oldMessages = old || [];
                    if (oldMessages.some((msg) => msg._id === data._id)) {
                        console.log("Tin nhắn đã tồn tại (WebSocket):", data._id);
                        return oldMessages;
                    }
                    const senderId = typeof data.senderId === "object" ? data.senderId._id : data.senderId;
                    const receiverId = typeof data.receiverId === "object" ? data.receiverId._id : data.receiverId;
                    const isRelevantMessage =
                        (senderId === userId && receiverId === businessId) ||
                        (senderId === businessId && receiverId === userId);
                    if (!isRelevantMessage) {
                        console.log("Tin nhắn không thuộc cuộc trò chuyện này:", data);
                        return oldMessages;
                    }
                    if (senderId !== (userId || businessId) && onNewMessage) {
                        onNewMessage(data);
                    }
                    return [...oldMessages, data];
                });
            }
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket closed");
        };

        wsRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Cleanup
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [userId, businessId, queryClient, onNewMessage]);

    return {
        messages: messages || [],
        isLoading,
        error,
        sendMessage: sendMessageMutation.mutate,
        markAsRead: markAsReadMutation.mutate,
    };
};

export const useBusinessesForUser = (userId) => {
    return useQuery({
        queryKey: ["businessesForUser", userId],
        queryFn: () => fetchBusinessesForUser(userId),
        enabled: !!userId,
    });
};

export const useUsersForBusiness = (businessId) => {
    return useQuery({
        queryKey: ["usersForBusiness", businessId],
        queryFn: () => fetchUsersForBusiness(businessId),
        enabled: !!businessId,
    });
};

export default useChat;
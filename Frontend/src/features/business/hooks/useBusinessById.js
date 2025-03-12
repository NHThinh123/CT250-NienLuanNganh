import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getBusinessByIdApi } from "../services/businessApi";

const useBusinessById = (id) => {
  const queryClient = useQueryClient();
  const wsRef = useRef(null);

  const {
    data: businessData = {},
    isLoading: isLoading,
    isError: isError,
    refetch,
  } = useQuery({
    queryKey: ["businesses", id],
    queryFn: () => getBusinessByIdApi(id),
  });

  // Khởi tạo WebSocket
  useEffect(() => {
    wsRef.current = new WebSocket(`ws://localhost:8080`); // Thay bằng URL WebSocket của bạn

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      // Gửi businessId để server biết client đang theo dõi business nào
      wsRef.current.send(JSON.stringify({ businessId: id }));
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "businessUpdated" && message.businessId === id) {
        console.log("Business updated, refetching data...");
        refetch();
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [id, refetch]);

  return { businessData, isLoading, isError, refetch };
};

export default useBusinessById;
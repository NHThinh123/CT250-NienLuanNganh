import { useQuery } from "@tanstack/react-query";
import { fetchBillingData } from "../services/businessApi";

export const useBilling = (businessId, enabled = false) => {
    return useQuery({
        queryKey: ["billing", businessId],
        queryFn: () => fetchBillingData(businessId),
        enabled,
        staleTime: 5 * 60 * 1000,
    });
};
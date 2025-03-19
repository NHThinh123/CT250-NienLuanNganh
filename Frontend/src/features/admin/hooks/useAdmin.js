import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAllBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getTotalRevenue,
    getAllInvoices,
} from "../services/adminApi";
import { message } from "antd";

export const useAdmin = () => {
    const queryClient = useQueryClient();

    const {
        data: users,
        isLoading: isUsersLoading,
        error: usersError,
    } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
        retry: false,
    });
    // Mutation để tạo user
    const createUserMutation = useMutation({
        mutationFn: (data) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            message.success("Tạo tài khoản User thành công!");
        },
        onError: (error) => {
            if (error.message === "Email đã tồn tại") {
                message.error("Email đã tồn tại, vui lòng sử dụng email khác!");
            } else {
                message.error(`Failed to create user: ${error.message}`);
            }
        },
    });
    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }) => updateUser({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });

    const {
        data: businesses,
        isLoading: isBusinessesLoading,
        error: businessesError,
    } = useQuery({
        queryKey: ["businesses"],
        queryFn: getAllBusinesses,
        retry: false,
    });

    const createBusinessMutation = useMutation({
        mutationFn: (data) => createBusiness(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["businesses"]);
            message.success("Business created successfully!");
        },
        onError: (error) => {
            if (error.message === "Email đã tồn tại") {
                message.error("Email đã tồn tại, vui lòng sử dụng email khác!");
            } else {
                message.error(`Failed to create business: ${error.message}`);
            }
        },
    });

    const updateBusinessMutation = useMutation({
        mutationFn: ({ id, data }) => updateBusiness({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries(["businesses"]);
        },
    });

    const deleteBusinessMutation = useMutation({
        mutationFn: (id) => deleteBusiness(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["businesses"]);
        },
    });
    // Query cho tổng doanh thu
    const {
        data: revenueData,
        isLoading: isRevenueLoading,
        error: revenueError,
    } = useQuery({
        queryKey: ["totalRevenue"],
        queryFn: getTotalRevenue,
        retry: false,
    });
    const {
        data: invoicesData,
        isLoading: isInvoicesLoading,
        error: invoicesError,
    } = useQuery({
        queryKey: ["invoices"],
        queryFn: getAllInvoices,
        retry: false,
        onError: (error) => {
            message.error(`Failed to fetch invoices: ${error.message}`);
        },
    });
    return {
        users: users || [],
        isUsersLoading,
        usersError,
        createUser: createUserMutation.mutate,
        createUserLoading: createUserMutation.isLoading,
        updateUser: updateUserMutation.mutate,
        updateUserLoading: updateUserMutation.isLoading,
        deleteUser: deleteUserMutation.mutate,
        deleteUserLoading: deleteUserMutation.isLoading,
        businesses: businesses || [],
        isBusinessesLoading,
        businessesError,
        createBusiness: createBusinessMutation.mutate,
        createBusinessLoading: createBusinessMutation.isLoading,
        updateBusiness: updateBusinessMutation.mutate,
        updateBusinessLoading: updateBusinessMutation.isLoading,
        deleteBusiness: deleteBusinessMutation.mutate,
        deleteBusinessLoading: deleteBusinessMutation.isLoading,
        totalRevenue: revenueData?.totalRevenue || 0,
        isRevenueLoading,
        revenueError,
        invoices: invoicesData || [],
        isInvoicesLoading,
        invoicesError,
    };
};
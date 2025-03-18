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
} from "../services/adminApi";

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

    const createUserMutation = useMutation({
        mutationFn: (data) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
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
    };
};
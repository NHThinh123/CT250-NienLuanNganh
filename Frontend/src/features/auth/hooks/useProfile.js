import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/userApi";

export const useUpdateProfile = () => {
    return useMutation(({ id, data }) => updateUser(id, data));
};

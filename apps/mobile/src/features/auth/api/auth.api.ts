import { api } from "../../../api/client";

type ApiResponse<T> = {
    data: T;
};

type AuthPayload = {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};

export const loginRequest = async (
    email: string,
    password: string
) => {
    const res = await api.post<ApiResponse<AuthPayload>>("/auth/login", {
        email,
        password,
    });

    return res.data.data;
}

export const registerRequest = async (
    name: string,
    email: string,
    password: string
) => {
    const res = await api.post("/auth/register", {
        name,
        email,
        password,
    });

    return res.data.data;
}

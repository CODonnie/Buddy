import { api } from "../../../api/client";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudySession = {
  id: string;
  title: string;
  subject: string | null;
  goal: string | null;
  startedAt: string;
  endedAt: string | null;
  duration: number | null;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type StartStudySessionInput = {
  title: string;
  subject?: string;
  goal?: string;
};

const withAuthorization = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export async function getProfile(token: string) {
  const response = await api.get<ApiResponse<UserProfile>>(
    "/users/me",
    withAuthorization(token),
  );

  return response.data.data;
}

export async function getCurrentStudySession(token: string) {
  const response = await api.get<ApiResponse<StudySession | null>>(
    "/study/current",
    withAuthorization(token),
  );

  return response.data.data;
}

export async function getStudyHistory(token: string) {
  const response = await api.get<ApiResponse<StudySession[]>>(
    "/study/history",
    withAuthorization(token),
  );

  return response.data.data;
}

export async function startStudySession(token: string, input: StartStudySessionInput) {
  const response = await api.post<ApiResponse<StudySession>>(
    "/study/start",
    input,
    withAuthorization(token),
  );

  return response.data.data;
}

export async function endStudySession(token: string, sessionId: string) {
  const response = await api.patch<ApiResponse<StudySession>>(
    `/study/${sessionId}/end`,
    undefined,
    withAuthorization(token),
  );

  return response.data.data;
}

import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import {
  endStudySession,
  getCurrentStudySession,
  getProfile,
  getStudyHistory,
  startStudySession,
} from "../../study/api/study.api";

export default function HomeScreen() {
  const { token, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");

  const profileQuery = useQuery({
    queryKey: ["profile", token],
    queryFn: () => getProfile(token!),
    enabled: Boolean(token),
  });
  const currentSessionQuery = useQuery({
    queryKey: ["study", "current", token],
    queryFn: () => getCurrentStudySession(token!),
    enabled: Boolean(token),
  });
  const historyQuery = useQuery({
    queryKey: ["study", "history", token],
    queryFn: () => getStudyHistory(token!),
    enabled: Boolean(token),
  });

  const refreshStudyData = () =>
    queryClient.invalidateQueries({ queryKey: ["study"] });

  const startSessionMutation = useMutation({
    mutationFn: () =>
      startStudySession(token!, {
        title: title.trim(),
        subject: subject.trim() || undefined,
        goal: goal.trim() || undefined,
      }),
    onSuccess: () => {
      setTitle("");
      setSubject("");
      setGoal("");
      void refreshStudyData();
    },
  });
  const endSessionMutation = useMutation({
    mutationFn: (sessionId: string) => endStudySession(token!, sessionId),
    onSuccess: () => {
      void refreshStudyData();
    },
  });

  const isLoading =
    profileQuery.isLoading || currentSessionQuery.isLoading || historyQuery.isLoading;
  const error =
    profileQuery.error ||
    currentSessionQuery.error ||
    historyQuery.error ||
    startSessionMutation.error ||
    endSessionMutation.error;
  const currentSession = currentSessionQuery.data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buddy</Text>
      <Text style={styles.subtitle}>API-connected study dashboard</Text>

      {isLoading ? <ActivityIndicator size="large" /> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile · GET /users/me</Text>
        <Text>{profileQuery.data?.name}</Text>
        <Text>{profileQuery.data?.email}</Text>
        {profileQuery.data?.bio ? <Text>{profileQuery.data.bio}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current session · GET /study/current</Text>
        {currentSession ? (
          <>
            <Text>{currentSession.title}</Text>
            <Text>Status: {currentSession.status}</Text>
            <Button
              title={endSessionMutation.isPending ? "Ending..." : "End session"}
              disabled={endSessionMutation.isPending}
              onPress={() => endSessionMutation.mutate(currentSession.id)}
            />
          </>
        ) : (
          <Text>No active study session.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Start session · POST /study/start</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title (at least 3 characters)"
          style={styles.input}
        />
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
          style={styles.input}
        />
        <TextInput value={goal} onChangeText={setGoal} placeholder="Goal" style={styles.input} />
        <Button
          title={startSessionMutation.isPending ? "Starting..." : "Start session"}
          disabled={!title.trim() || Boolean(currentSession) || startSessionMutation.isPending}
          onPress={() => startSessionMutation.mutate()}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>History · GET /study/history</Text>
        {historyQuery.data?.length ? (
          historyQuery.data.map((session) => (
            <Text key={session.id} style={styles.historyItem}>
              {session.title} — {session.status}
            </Text>
          ))
        ) : (
          <Text>No sessions recorded.</Text>
        )}
      </View>

      {error ? (
        <Text style={styles.error}>Request failed. Check the API URL and server connection.</Text>
      ) : null}

      <Button
        title="Refresh API data"
        onPress={() => {
          void refreshStudyData();
          void profileQuery.refetch();
        }}
      />
      <View style={styles.logout}>
        <Button title="Logout" onPress={() => { void logout(); }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { fontSize: 30, fontWeight: "700" },
  subtitle: { color: "#4b5563", marginBottom: 4 },
  card: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 14, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#9ca3af", borderRadius: 6, padding: 10 },
  historyItem: { borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 8 },
  error: { color: "#b91c1c" },
  logout: { marginTop: 8, marginBottom: 24 },
});

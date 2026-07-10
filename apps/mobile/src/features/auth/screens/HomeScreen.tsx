import { View, Text, Button } from "react-native";
import { useAuthStore } from "../store/auth.store";

export default function HomeScreen() {
    const { user, logout } = useAuthStore();


    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome 👋</Text>

            <Text>Name: {user?.name}</Text>
            <Text>Email: {user?.email}</Text>

            <Button title="Logout" onPress={logout} />
        </View>
    );
}

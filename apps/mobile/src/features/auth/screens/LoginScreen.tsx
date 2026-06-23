import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { loginRequest } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";


export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async () => {
        try {
            const data = await loginRequest(email, password);
            
            setAuth(data.user, data.accessToken);

            navigation.replace('Home');
        } catch (err) {
            console.log("Login error:", err);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

            <TextInput
                placeholder="Email"
                onChangeText={setEmail}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button title="Login" onPress={handleLogin} />

            <Button
                title="Don't have an account? Register"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
}
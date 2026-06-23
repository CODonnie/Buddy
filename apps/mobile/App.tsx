import { useEffect } from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/features/auth/store/auth.store";

export default function App() {
  const restoreSession = useAuthStore(
    (state) => state.restoreSession
  );

  useEffect(() => {
    restoreSession();
  }, []);

  
  return <RootNavigator />;
}
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/features/auth/store/auth.store";

const queryClient = new QueryClient();

export default function App() {
  const restoreSession = useAuthStore(
    (state) => state.restoreSession
  );

  useEffect(() => {
    restoreSession();
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}

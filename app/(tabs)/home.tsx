import DealerHomeScreen from "@/src/screens/home/DealarHomePage";
import { useAuth } from "../../src/contexts/AuthContext";
import HomeScreen from "../../src/screens/home/HomeScreen";

export default function Home() {
  const { user } = useAuth();

  if (user?.userType === "main_dealer") {
    return <DealerHomeScreen />;
  }

  return <HomeScreen />;
}

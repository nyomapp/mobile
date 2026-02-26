import DealerHomeScreen from "@/src/screens/home/DealarHomePage";
import { useAuth } from "../../src/contexts/AuthContext";
import HomeScreen from "../../src/screens/home/HomeScreen";

export default function Home() {
  const { user } = useAuth();
  const hasSalesManagerRole = (user as any)?.roles?.some(
    (role: any) => role?.title === "SalesManager",
  );

  if (user?.userType === "main_dealer") {
    return <DealerHomeScreen />;
  } else if (hasSalesManagerRole) {
    return <DealerHomeScreen />;
  } else {
    return <HomeScreen />;
  }
}

import React from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { DeliveryProvider } from "./DeliveryContext";
import { ModelsProvider } from "./ModelsContext";
import { MasterDataProvider } from "./MasterDataContext";
import { FinancierDataProvider } from "./FinancierDataContext";
import { DeliveryHomePageProvider } from "./DeliveryHomePageContext";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <ModelsProvider>
          <DeliveryProvider>
            <MasterDataProvider>
              <FinancierDataProvider>
                <DeliveryHomePageProvider>
                {children}
                </DeliveryHomePageProvider>
              </FinancierDataProvider>
            </MasterDataProvider>
          </DeliveryProvider>
        </ModelsProvider>
      </UserProvider>
    </AuthProvider>
  );
};

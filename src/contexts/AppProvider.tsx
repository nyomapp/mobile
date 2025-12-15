import React from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { DeliveryProvider } from "./DeliveryContext";
import { ModelsProvider } from "./ModelsContext";
import { MasterDataProvider } from "./MasterDataContext";
import { FinancierDataProvider } from "./FinancierDataContext";
import { DeliveryHomePageProvider } from "./DeliveryHomePageContext";
import { DocumentUploadProvider } from "./DocumentUploadContext";
import { DocumentArrayProvider } from "./DocumentArray1";

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
                  <DocumentUploadProvider>
                    <DocumentArrayProvider>
                      <DocumentUploadProvider>
                        {children}
                      </DocumentUploadProvider>
                    </DocumentArrayProvider>
                  </DocumentUploadProvider>
                </DeliveryHomePageProvider>
              </FinancierDataProvider>
            </MasterDataProvider>
          </DeliveryProvider>
        </ModelsProvider>
      </UserProvider>
    </AuthProvider>
  );
};

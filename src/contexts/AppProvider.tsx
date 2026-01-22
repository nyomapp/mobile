import React from "react";
import { AuthProvider } from "./AuthContext";
import { DashBoardProvider } from "./DashBoardContext";
import { DeliveryProvider } from "./DeliveryContext";
import { DeliveryHomePageProvider } from "./DeliveryHomePageContext";
import { DocumentArrayProvider } from "./DocumentArray1";
import { DocumentArray2Provider } from "./DocumentArray2";
import { DocumentUploadProvider } from "./DocumentUploadContext";
import { ExecutiveDataProvider } from "./ExecutiveDataContext";
import { FinancierDataProvider } from "./FinancierDataContext";
import { MasterDataProvider } from "./MasterDataContext";
import { ModelsProvider } from "./ModelsContext";
import { SearchProvider } from "./SearchContext";
import { UserProvider } from "./UserContext";
import { UsersDataProvider } from "./UsersDataContext";

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
                      <DocumentArray2Provider>
                        <SearchProvider>
                          <UsersDataProvider>
                            <ExecutiveDataProvider>
                              <DashBoardProvider>{children}</DashBoardProvider>
                            </ExecutiveDataProvider>
                          </UsersDataProvider>
                        </SearchProvider>
                      </DocumentArray2Provider>
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

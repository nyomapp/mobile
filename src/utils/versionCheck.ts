import { APP_CONFIG, API_ENDPOINTS } from "../api/config";
import { apiClient } from "../api/client";

export const checkAppVersion = async () => {
  try {
    const response = await apiClient.get<{
      latestVersion?: string;
      latestApk?: string;
    }>(API_ENDPOINTS.MasterData.GET);
    if (response.success && response.data) {
      const { latestVersion, latestApk } = response.data;
      if (latestVersion && latestApk) {
        return {
          needsUpdate: compareVersions(APP_CONFIG.VERSION, latestVersion) < 0,
          latestVersion,
          downloadUrl: latestApk,
        };
      }
    }
    return { needsUpdate: false };
  } catch {
    return { needsUpdate: false };
  }
};

const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
};

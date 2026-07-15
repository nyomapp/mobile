import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";

interface VersionCheckProps {
  currentVersion: string;
  latestVersion: string;
  downloadUrl: string;
  onClose: () => void;
}

export const VersionCheck: React.FC<VersionCheckProps> = ({
  currentVersion,
  latestVersion,
  downloadUrl,
  onClose,
}) => {
  const [showUpdateModal, setShowUpdateModal] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleUpdate = () => {
    setShowUpdateModal(false);
    setShowWarningModal(true);
  };

  const handleDownload = async () => {
    try {
      await Linking.openURL(downloadUrl);
      setShowWarningModal(false);
      onClose();
    } catch (error) {
      console.error("Failed to open download link:", error);
    }
  };

  return (
    <>
      {/* Update Available Modal */}
      <Modal
        visible={showUpdateModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Update Available</Text>
            <Text style={styles.message}>
              A new version ({latestVersion}) is available.{"\n"}
              Current version: {currentVersion}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowUpdateModal(false);
                  onClose();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Warning Modal */}
      <Modal
        visible={showWarningModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setShowWarningModal(false);
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.warningTitle}>Warning</Text>
            <Text style={styles.warningMessage}>
              After downloading & before installing the latest version, please
              uninstall the old version.
            </Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload}
            >
              <Text style={styles.updateButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.YellixBold || "System",
    color: COLORS.black,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: FONTS.YellixThin || "System",
    color: COLORS.black,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  warningTitle: {
    fontSize: 20,
    fontFamily: FONTS.YellixBold || "System",
    color: "#DC2626",
    marginBottom: 12,
    marginTop: 20,
    textAlign: "center",
  },
  warningMessage: {
    fontSize: 14,
    fontFamily: FONTS.YellixThin || "System",
    color: COLORS.black,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  updateButton: {
    backgroundColor: COLORS.primaryBlue || "#3B82F6",
  },
  downloadButton: {
    backgroundColor: COLORS.primaryBlue || "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "stretch",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: FONTS.YellixMedium || "System",
    color: COLORS.black,
  },
  updateButtonText: {
    fontSize: 16,
    fontFamily: FONTS.YellixMedium || "System",
    color: "white",
  },
});

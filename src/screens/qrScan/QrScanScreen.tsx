import {
  mapQRCodeToCertificate,
  searchByCertificateNumber,
  searchByChassisNumber,
  searchByMobileNumber,
} from "@/src/api/search";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS, FONTS } from "@/src/constants";
import { allStyles } from "@/src/styles/global";
import { globalStyles } from "@/src/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/deliveries/deliveryHomeStyles";

export default function QrScanScreen() {
  const [chassisNumber, setChassisNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [optionsModal, setOptionsModal] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const [manualModal, setManualModal] = useState(false);
  const [manualQrCode, setManualQrCode] = useState("");
  const [isMapping, setIsMapping] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  const triggerSearch = async (
    chassis: string,
    mobile: string,
    cert: string,
  ) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      let data: any;
      if (cert) data = await searchByCertificateNumber(cert);
      else if (chassis) data = await searchByChassisNumber(chassis);
      else data = await searchByMobileNumber(mobile);
      setResults(
        Array.isArray(data) ? data : (data?.results ?? (data ? [data] : [])),
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Search Error",
        text2: (error as any).message || "Search failed.",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!chassisNumber && !mobileNumber && !certNumber) {
      Toast.show({
        type: "error",
        text1: "Validation",
        text2: "Enter at least one search field.",
      });
      return;
    }
    if (chassisNumber && chassisNumber.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Validation",
        text2: "Chassis number must be exactly 6 characters.",
      });
      return;
    }
    if (mobileNumber && mobileNumber.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Validation",
        text2: "Mobile number must be exactly 10 digits.",
      });
      return;
    }
    if (certNumber && certNumber.length !== 15) {
      Toast.show({
        type: "error",
        text1: "Validation",
        text2: "Certificate number must be exactly 15 characters.",
      });
      return;
    }
    await triggerSearch(chassisNumber, mobileNumber, certNumber);
  };

  const handleClear = () => {
    setChassisNumber("");
    setMobileNumber("");
    setCertNumber("");
    setResults([]);
    setHasSearched(false);
  };

  const openOptions = (cert: any) => {
    setSelectedCert(cert);
    setOptionsModal(true);
  };

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2: "Camera permission is required.",
        });
        return;
      }
    }
    scannedRef.current = false;
    setOptionsModal(false);
    setCameraModal(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    const match = data.match(/\/qr\/([A-Za-z0-9-]+)$/);
    if (!match) {
      setCameraModal(false);
      Toast.show({
        type: "error",
        text1: "Invalid QR Code",
        text2: "This is not a valid Nyom QR.",
      });
      return;
    }
    const qrCode = match[1];
    setCameraModal(false);
    await callMapApi(qrCode);
  };

  const callMapApi = async (qrCode: string) => {
    if (!selectedCert?._id && !selectedCert?.id) return;
    setIsMapping(true);
    try {
      await mapQRCodeToCertificate(qrCode, selectedCert._id || selectedCert.id);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Successfully mapped with QR Code ${qrCode}`,
      });
      handleApply();
    } catch (error) {
      const msg = ((error as any).message || "").toLowerCase();
      const isAlreadyMapped =
        (error as any).isAlreadyMapped ||
        msg.includes("already") ||
        msg.includes("502");
      if (isAlreadyMapped) {
        Toast.show({
          type: "error",
          text1: "Already Assigned",
          text2: "This QR code is already mapped. Try another QR code.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Mapping Failed",
          text2: (error as any).message || "Failed to map QR code.",
        });
      }
    } finally {
      setIsMapping(false);
    }
  };

  const handleManualSave = async () => {
    if (!manualQrCode.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation",
        text2: "Please enter a QR code.",
      });
      return;
    }
    setManualModal(false);
    await callMapApi(manualQrCode.trim());
    setManualQrCode("");
  };

  const renderCard = ({ item }: { item: any }) => {
    const alreadyMapped = item.qrCode || item.qrCodeRef;
    const qrCodeValue = item.qrCode || item.qrCodeRef?.qrCode;
    const certNum = item.certificateNumber || item.certNumber || "";
    const name = `${item.firstName || ""} ${item.lastName || ""}`.trim();

    return (
      <View>
        {alreadyMapped && (
          <View style={mappedBannerStyle}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.primaryBlue}
            />
            <Text style={mappedBannerText}>
              {name}, {certNum} already mapped with QR code {qrCodeValue}
            </Text>
          </View>
        )}
        <View style={allStyles.customerCard}>
          <View style={allStyles.cardHeader}>
            <View style={allStyles.cardContent}>
              <View style={allStyles.avatar}>
                <Text style={allStyles.avatarText}>
                  {item.firstName?.charAt(0)?.toUpperCase() || "A"}
                </Text>
              </View>
              <View style={allStyles.customerInfo}>
                <Text style={allStyles.customerName}>{name}</Text>
                <Text style={allStyles.detailValue}>
                  {item.vehicleModelRef?.name || item.model || ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={allStyles.customerDetails}>
            <View style={allStyles.detailText}>
              <Text style={allStyles.detailLabel}>Chassis Number</Text>
              <Text style={allStyles.detailValue}>
                {item.chassisNumber || ""}
              </Text>
            </View>
            <View style={allStyles.verticalLine} />
            <View style={allStyles.detailText}>
              <Text style={allStyles.detailLabel}>Mobile Number</Text>
              <Text style={allStyles.detailValue}>
                {"*".repeat(6) + (item.mobileNumber?.slice(-4) || "")}
              </Text>
            </View>
            <View style={allStyles.verticalLine} />
            <View style={allStyles.detailText}>
              <Text style={allStyles.detailLabel}>Certificate Number</Text>
              <Text style={allStyles.detailValue}>{certNum}</Text>
            </View>
          </View>

          {!alreadyMapped && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => openOptions(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>Map QR</Text>
              <Image
                source={require("@/assets/icons/qrcodetabfilledicon.png")}
                style={{ width: 15, height: 15 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={allStyles.headerContainer}>
          <HeaderIcon />
        </View>
        <View style={{ paddingBottom: responsiveWidth(2) }}>
          <Text style={allStyles.pageTitle}>QR Scan</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={allStyles.scrollContent}
        >
          <TextInput
            style={globalStyles.input}
            placeholder="Chassis Number (Last 6 Characters)"
            value={chassisNumber}
            onChangeText={(t) => {
              const val = t
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 6);
              setChassisNumber(val);
            }}
            autoCapitalize="characters"
            maxLength={6}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={(t) => {
              const val = t.replace(/[^0-9]/g, "").slice(0, 10);
              setMobileNumber(val);
            }}
            keyboardType="numeric"
            maxLength={10}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Certificate Number"
            value={certNumber}
            onChangeText={(t) => {
              const val = t
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 15);
              setCertNumber(val);
            }}
            autoCapitalize="characters"
            maxLength={15}
          />

          <View style={{ flexDirection: "row", gap: responsiveWidth(3) }}>
            <TouchableOpacity
              style={[allStyles.btn, { flex: 1, marginTop: 0 }]}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={allStyles.btnText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[clearBtnStyle, { flex: 1 }]}
              onPress={handleClear}
              activeOpacity={0.8}
            >
              <Text style={clearBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primaryBlue}
              style={{ marginTop: responsiveWidth(8) }}
            />
          ) : hasSearched && results.length === 0 ? (
            <View
              style={{ alignItems: "center", marginTop: responsiveWidth(8) }}
            >
              <Text
                style={{
                  fontFamily: FONTS.Yellix,
                  fontSize: responsiveFontSize(2),
                  color: "#6B7280",
                }}
              >
                No results found
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              renderItem={renderCard}
              keyExtractor={(item, i) => item._id || item.id || String(i)}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingTop: responsiveWidth(4),
                paddingBottom: responsiveWidth(10),
              }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal 1: Options — Scan or Manual */}
      <Modal
        visible={optionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOptionsModal(false)}
      >
        <View style={allStyles.modalOverlay}>
          <View
            style={[allStyles.modalContent, { padding: responsiveWidth(5) }]}
          >
            <View style={allStyles.modalHeader}>
              <Text style={allStyles.modalTitle}>Map QR Code</Text>
              <TouchableOpacity
                onPress={() => setOptionsModal(false)}
                style={allStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6C757D" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingVertical: responsiveWidth(4),
                gap: responsiveWidth(3),
              }}
            >
              <TouchableOpacity
                style={[
                  allStyles.btn,
                  {
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: responsiveWidth(2),
                    marginTop: 0,
                  },
                ]}
                onPress={handleOpenCamera}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={allStyles.btnText}>Scan QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  allStyles.btn,
                  {
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: responsiveWidth(2),
                    marginTop: 0,
                  },
                ]}
                onPress={() => {
                  setOptionsModal(false);
                  setManualQrCode("");
                  setManualModal(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={allStyles.btnText}>Manually Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Camera Scanner */}
      <Modal
        visible={cameraModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCameraModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarCodeScanned}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: responsiveWidth(12),
              right: responsiveWidth(5),
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: responsiveWidth(5),
              padding: responsiveWidth(2),
            }}
            onPress={() => setCameraModal(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {isMapping && (
            <View
              style={{
                position: "absolute",
                bottom: responsiveWidth(10),
                alignSelf: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.white} />
            </View>
          )}
        </View>
      </Modal>

      {/* Modal 3: Manual Entry */}
      <Modal
        visible={manualModal}
        transparent
        animationType="slide"
        onRequestClose={() => setManualModal(false)}
      >
        <View style={allStyles.modalOverlay}>
          <View
            style={[allStyles.modalContent, { padding: responsiveWidth(5) }]}
          >
            <View style={allStyles.modalHeader}>
              <Text style={allStyles.modalTitle}>Enter QR Code</Text>
              <TouchableOpacity
                onPress={() => setManualModal(false)}
                style={allStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6C757D" />
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: responsiveWidth(4) }}>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter QR Code (e.g. AAAA-000)"
                value={manualQrCode}
                onChangeText={setManualQrCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[
                  allStyles.btn,
                  {
                    marginTop: responsiveWidth(2),
                    opacity: isMapping ? 0.7 : 1,
                  },
                ]}
                onPress={handleManualSave}
                disabled={isMapping}
                activeOpacity={0.8}
              >
                {isMapping ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={allStyles.btnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}

const clearBtnStyle = {
  backgroundColor: COLORS.white,
  paddingVertical: responsiveWidth(2),
  borderRadius: responsiveWidth(2),
  alignItems: "center" as const,
  borderColor: COLORS.primaryBlue,
  borderWidth: 1,
};
const clearBtnText = {
  color: COLORS.primaryBlue,
  fontSize: responsiveFontSize(2.2),
  fontFamily: FONTS.YellixThin,
};
const mappedBannerStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: responsiveWidth(2),
  backgroundColor: "#EFF6FF",
  borderRadius: responsiveWidth(2),
  paddingHorizontal: responsiveWidth(3),
  paddingVertical: responsiveWidth(2),
  marginBottom: responsiveWidth(2),
  borderLeftWidth: 3,
  borderLeftColor: COLORS.primaryBlue,
};
const mappedBannerText = {
  flex: 1,
  fontFamily: FONTS.YellixThin,
  fontSize: responsiveFontSize(1.6),
  color: COLORS.primaryBlue,
};

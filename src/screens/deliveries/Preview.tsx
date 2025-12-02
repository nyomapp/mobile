import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { FONTS } from "@/src/constants";
import { router } from "expo-router";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/previewStyles";
interface DetailField {
  label: string;
  value: string;
}

interface DocumentItem {
  title: string;
  image: any; // You can replace with actual image imports
}

export default function PreviewScreen() {
  // Sample data - replace with actual data from props or context
  const detailsData: DetailField[] = [
    { label: "Customer Name:", value: "John Doe" },
    { label: "Frame Number:", value: "ABC123456789" },
    { label: "Mobile Number:", value: "+91 9876543210" },
    { label: "Model:", value: "Hero Splender" },
  ];

  const moreDetailsData: DetailField[] = [
    { label: "Ex-Showroom", value: "₹50,000" },
    { label: "Insurance", value: "₹5,000" },
    { label: "RTO", value: "₹8,000" },
    { label: "Accessories", value: "₹2,000" },
    { label: "Helmet", value: "₹1,500" },
    { label: "RSA", value: "₹1,000" },
    { label: "Other 1", value: "₹500" },
    { label: "Other 2", value: "₹300" },
    { label: "Other 3", value: "₹200" },
    { label: "Total Amount", value: "₹68,500" },
  ];

  const documentsData: DocumentItem[] = [
    { title: "Aadhar Card Front", image: null },
    { title: "Aadhar Card Back", image: null },
    { title: "Driving License Front", image: null },
    { title: "Customer Photo", image: null },
    { title: "Aadhar Voter", image: null },
    { title: "Aadhar Back", image: null },
  ];
  const handleBack = () => {
    // Navigate back to the previous screen
    console.log("Back button pressed");
    router.back();
  };
  const renderDetailSection = (
    title: string,
    data: DetailField[],
    showAsInputs: boolean = false
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Image
            source={require("@/assets/icons/previewPageEditIcon.png")}
            // style={styles.img}
            width={24}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {data.map((item, index) => (
        <View
          key={index}
          style={showAsInputs ? styles.detailRowSpaced : styles.detailRow}
        >
          <Text style={[styles.detailLabel, showAsInputs ?{fontFamily: FONTS.YellixThin}  :null ]}>{item.label}</Text>
          {showAsInputs ? (
            <View style={styles.amountInputBox}>
              <Text style={styles.amountPlaceholder}>{item.value}</Text>
            </View>
          ) : (
            <Text style={styles.detailValue}>{item.value}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderIcon />
        </View>
        <View
          style={[allStyles.pageHeader, { paddingTop: responsiveWidth(2) }]}
        >
          <View>
            <Text style={[allStyles.pageTitle]}>Preview</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={allStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          //   contentContainerStyle={styles.scrollContent}
        >
          {/* Details Section */}
          {renderDetailSection("Details", detailsData)}

          {/* More Details Section */}
          {renderDetailSection("More Details", moreDetailsData, true)}

          {/* Documents Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Documents</Text>
              <TouchableOpacity>
                <Image
                  source={require("@/assets/icons/previewPageEditIcon.png")}
                  // style={styles.img}
                  width={24}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {documentsData.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <View style={styles.documentImageContainer}>
                  {doc.image ? (
                    <Image source={doc.image} style={styles.documentImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <View style={styles.placeholderContent}>
                        <View style={styles.placeholderHeader}>
                          <View style={styles.placeholderFlag} />
                          <Text style={styles.placeholderText}>
                            GOVERNMENT OF INDIA
                          </Text>
                        </View>
                        <View style={styles.placeholderBody}>
                          <View style={styles.placeholderPhoto} />
                          <View style={styles.placeholderInfo}>
                            <View style={styles.placeholderLine} />
                            <View style={styles.placeholderLine} />
                            <View style={styles.placeholderLineShort} />
                          </View>
                        </View>
                        <View style={styles.placeholderQR} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View
          style={[
            allStyles.bottomContainer,
            { paddingHorizontal: responsiveWidth(4) },
          ]}
        >
          <TouchableOpacity style={allStyles.btn}>
            <Text style={allStyles.btnText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={allStyles.backButton} onPress={handleBack}>
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

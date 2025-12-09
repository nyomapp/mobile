import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/deliveries/documentsStyles";
import { allStyles } from "../../styles/global";

export default function OtherDocumentsScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    // Navigate to next step
    //console.log("Next button pressed");
    router.push("/amount");
  };

  const handleDocumentUpload = (documentType: string) => {
    //console.log(`Upload ${documentType}`);
    router.push("/document-scanner");
    // Implement document upload logic
  };

  const documentTypes = [
    {
      id: 1,
      title: "Invoice",
      icon: require("@/assets/icons/DocumentPageBikeFrontSideIcon.png"),
      uploaded: true,
    },
    {
      id: 2,
      title: "Insurance",
      icon: require("@/assets/icons/DocumentPageBikeSideWiseIcon.png"),
      uploaded: false,
    },
    {
      id: 3,
      title: "Helmet Invoice",
      icon: require("@/assets/icons/DocumentPageFrameIcon.png"),
      uploaded: false,
    },
    {
      id: 4,
      title: "Form 20 - 1",
      icon: require("@/assets/icons/DocumentPageCustomerPhotoIcon.png"),
      uploaded: false,
    },
    {
      id: 5,
      title: "Form 20 - 2",
      icon: require("@/assets/icons/DocumnetPageAdhaarFrontIcon.png"),
      uploaded: false,
    },
    {
      id: 6,
      title: "Form 20 - 3",
      icon: require("@/assets/icons/DocumnetPageAdhaarBackIcon.png"),
    },
    {
      id: 7,
      title: "Form 20",
      icon: require("@/assets/icons/DocumnetPageAdhaarBackIcon.png"),
    },
  ];

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={[allStyles.pageHeader, { paddingTop: responsiveWidth(6) }]}>
          <View>
            {/* <Text style={allStyles.pageTitle}>
            <b>Add</b>
            {"\n"}Delivery
          </Text> */}
            <Text style={[allStyles.Title, { marginBottom: responsiveWidth(0) }]}>Documents</Text>
          </View>

          <HeaderIcon />
        </View>

        <ScrollView
          style={{ marginTop: responsiveWidth(4) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Documents Title */}


          {/* Document Upload Cards */}
          {documentTypes.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[
                globalStyles.input,
                styles.documentCard,
                doc.uploaded && styles.documentUploadedCard,
              ]}
              onPress={() => handleDocumentUpload(doc.title)}
              activeOpacity={0.7}
            >
              <View style={styles.documentLeft}>
                <View style={styles.iconContainer}>
                  <Image
                    source={doc.icon}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.documentTitle}>{doc.title}</Text>
              </View>
              <TouchableOpacity
                //   style={styles.uploadButton}
                onPress={() => handleDocumentUpload(doc.title)}
              >
                <Image
                  source={
                    doc.uploaded
                      ? require("@/assets/icons/DocumentsPageTickIcon.png")
                      : require("@/assets/icons/DocumentPageUplaodIcon.png")
                  }
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Buttons */}
        <View
          style={[
            allStyles.bottomContainer,
            //   { paddingHorizontal: responsiveWidth(4) },
          ]}
        >
          <TouchableOpacity style={allStyles.btn} onPress={handleNext}>
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



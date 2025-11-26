import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { TokenStorage, UsersAPI } from "../../api";
import { FormData } from "../../api/types";
import { useAuth } from "../../contexts/AuthContext";
import { dialogStyles, globalStyles, profileStyles } from "../../styles";
import { allStyles } from "../../styles/global";


export default function PersonalInfoScreen() {
  const { user, updateUser } = useAuth();
  const [sections, setSections] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [tempValue, setTempValue] = useState("");
  const [tempAnswerId, setTempAnswerId] = useState("");

  useEffect(() => {
    loadProfileQuestions();
  }, []);

  const loadProfileQuestions = async () => {
    try {
      const response = await UsersAPI.getProfileQuestions();
      if (response.success && response.data?.data?.sections) {
        setSections(response.data.data.sections);

        const initialFormData: FormData = {};
        response.data.data.sections.forEach((section: any) => {
          section.questions.forEach((question: any) => {
            const existingData = user?.profileData?.find(
              (p) => p.questionId === question.questionId
            );
            if (existingData) {
              initialFormData[question.questionId] = existingData;
            } else {
              initialFormData[question.questionId] = {
                questionId: question.questionId,
                question: question.question,
                question_shorthand: question.question_shorthand,
                answer: "",
                type: question.type,
              };
            }
          });
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load profile questions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (question: any) => {
    setCurrentQuestion(question);
    const formItem = formData[question.questionId];
    setTempValue(formItem?.answer || "");
    setTempAnswerId(formItem?.answerId || "");
    setShowDialog(true);
  };

  const handleDialogOK = async () => {
    if (currentQuestion) {
      // Validate age before saving
      if (currentQuestion.questionId === "1001") {
        const age = parseInt(tempValue);
        if (!tempValue || age < 11 || age > 99) {
          Toast.show({
            type: "error",
            text1: "Invalid Age",
            text2: "Age must be between 11 and 99",
          });
          return;
        }
      }

      const updatedFormData = {
        ...formData,
        [currentQuestion.questionId]: {
          ...formData[currentQuestion.questionId],
          answer: tempValue,
          answerId: tempAnswerId,
        },
      };
      setFormData(updatedFormData);

      await handleSaveWithData(updatedFormData);
    }
    setShowDialog(false);
    setCurrentQuestion(null);
  };


  const handleSaveWithData = async (updatedFormData: FormData) => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const profileData = Object.values(updatedFormData).filter(
        (item) => item.answer
      );

      const updateData = {
        ...user,
        profileData: profileData,
      };

      const response = await UsersAPI.updateUser(user.id, updateData);
      if (response.success && response.data?.data?.user) {
        await TokenStorage.setUser(response.data.data.user);
        await updateUser(response.data.data.user);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await handleSaveWithData(formData);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    setCurrentQuestion(null);
    setTempValue("");
    setTempAnswerId("");
  };

  const renderQuestion = (question: any) => {
    const formItem = formData[question.questionId];

    return (
      <TouchableOpacity
        key={question.questionId}
        style={[profileStyles.settingItem, styles.settingItemFixed]}
        onPress={() => openDialog(question)}
      >
        <View style={[profileStyles.settingLeft, styles.settingLeftFixed]}>
          <Text
            style={[profileStyles.settingText, styles.settingTextFixed]}
            numberOfLines={2}
          >
            {question.question_shorthand}
          </Text>
        </View>
        <View style={styles.settingRightContainer}>
          <Text
            style={[profileStyles.settingRight, styles.settingRightFixed]}
            numberOfLines={1}
          >
            {formItem?.answer || "Not set"}
          </Text>
          <Ionicons name="chevron-forward" style={profileStyles.forwardIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  const validateAge = (text: string): string => {
    return text.replace(/[^0-9]/g, '').slice(0, 2);
  };


  if (isLoading) {
    return (
      <ImageBackground
        source={require("../../../assets/plainBg.png")}
        style={globalStyles.container}
        resizeMode="cover"
      >
        <View style={profileStyles.solidHeader}>
          <View style={profileStyles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={globalStyles.headerTitle}>Personal Info</Text>
            <View style={profileStyles.headerRight}>{/* Blank */}</View>
          </View>
        </View>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFB200" />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (

    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]} keyboardShouldPersistTaps="handled">
      <ImageBackground
        source={require("../../../assets/plainBg.png")}
        style={globalStyles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(45,45,231,0)", "rgba(45,45,231,0)"]}
          style={globalStyles.container}
        >
          {/* Header */}
          <View style={allStyles.solidHeader}>
            <View style={allStyles.header}>
              <TouchableOpacity onPress={router.back}>
                <View style={allStyles.btnCircle}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={allStyles.headerTitle}>Personal Info</Text>
              <View style={allStyles.headerRight} />
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FFB200" />
              <Text style={styles.loaderText}>Loading...</Text>
            </View>
          ) : (
            <View style={allStyles.container}>
              <ScrollView contentContainerStyle={allStyles.scrollContent}>
                {sections.map((section, sectionIndex) => (
                  <View
                    key={sectionIndex}
                    style={[profileStyles.settingsGroup, styles.marginBottom]}
                  >
                    {section.questions.map(renderQuestion)}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <Modal visible={showDialog} transparent animationType="slide">
            <View style={dialogStyles.dialogOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <View style={dialogStyles.dialogContainer}>
                  <Text style={dialogStyles.dialogTitle}>
                    {currentQuestion?.question_shorthand}
                  </Text>
                  <View style={dialogStyles.dialogContent}>
                    {currentQuestion?.type === "input" ? (
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: "white",
                          marginVertical: 10,
                        }}
                        value={tempValue}
                        onChangeText={(text) => {
                          if (currentQuestion.questionId === "1001") {
                            setTempValue(validateAge(text));
                          } else {
                            setTempValue(text);
                          }
                        }}
                        placeholder="Enter your answer"
                        keyboardType={currentQuestion.questionId === "1001" ? "numeric" : "default"}
                        maxLength={currentQuestion.questionId === "1001" ? 2 : undefined}
                        autoFocus={true}
                      />
                    ) : (
                      <ScrollView style={dialogStyles.scrollView}>
                        <View style={dialogStyles.languageSelector}>
                          {currentQuestion?.answers?.map((answer: any) => (
                            <TouchableOpacity
                              key={answer.id}
                              style={[
                                dialogStyles.languageOption,
                                tempAnswerId === answer.id &&
                                dialogStyles.selectedLanguageOption,
                              ]}
                              onPress={() => {
                                setTempAnswerId(answer.id);
                                setTempValue(answer.answer);
                              }}
                            >
                              <Text
                                style={[
                                  dialogStyles.languageText,
                                  tempAnswerId === answer.id &&
                                  dialogStyles.selectedLanguageText,
                                ]}
                              >
                                {answer.answer}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    )}
                  </View>
                  <View style={dialogStyles.dialogButtons}>
                    <TouchableOpacity
                      style={dialogStyles.cancelButton}
                      onPress={handleDialogCancel}
                    >
                      <Text style={dialogStyles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        dialogStyles.okButton,
                        isSaving && { opacity: 0.7 },
                      ]}
                      onPress={handleDialogOK}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={dialogStyles.okButtonText}>OK</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>
        </LinearGradient>
        <Toast />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  marginVertical: {
    marginVertical: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  settingItemFixed: {
    minHeight: 80,
    alignItems: "center",
    paddingVertical: 15,
  },
  settingLeftFixed: {
    flex: 2,
    paddingRight: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  settingTextFixed: {
    fontSize: 16,
    lineHeight: 20,
    flexWrap: "wrap",
    textAlign: "left",
    marginLeft: 0,
  },
  settingRightContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  settingRightFixed: {
    fontSize: 14, // Slightly smaller
    marginRight: 8,
    textAlign: "right",
  },
});
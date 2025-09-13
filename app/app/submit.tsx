import React, { useState, useEffect  } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Camera, Video, Upload, Mic, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useRouter, useFocusEffect } from "expo-router"
import API_URL from "@/Constants";

export default function Submit() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
  });
  const navigation = useNavigation<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesVideos, setImagesVideos] = useState<any[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<any | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<any | null>(null);

  useEffect(() => {
    const checkLoginAndFetch = async () => {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.push("/login");
        }
    };
    checkLoginAndFetch();
  }, []);

  // Convert file URI to Blob
  async function uriToBlob(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }

  // Request signed URLs and upload files
  async function uploadFiles(fileInfoArray: any[], token: string) {
    console.log("=== UPLOAD FILES FUNCTION ===");
    console.log("Files to process:", fileInfoArray.length);
    
    // First, get signed URLs from backend
    const requestPayload = {
      files: fileInfoArray.map((f) => ({ name: f.name, type: f.type })),
    };
    
    console.log("Requesting signed URLs with payload:", JSON.stringify(requestPayload, null, 2));
    
    const res = await fetch(`${API_URL}/api/files/get-upload-urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });

    console.log("Signed URL request status:", res.status);
    console.log("Signed URL request ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.log("Signed URL error response:", errorText);
      throw new Error(`Failed to get upload URLs: ${res.status} - ${errorText}`);
    }

    const responseData = await res.json();
    console.log("Signed URL response data:", JSON.stringify(responseData, null, 2));
    
    const { uploadUrls } = responseData;
    const uploadedFilePaths: string[] = [];

    // Upload each file to the signed URL
    for (let i = 0; i < fileInfoArray.length; i++) {
      const fileInfo = fileInfoArray[i];
      const uploadUrlInfo = uploadUrls[i];
      
      // CRITICAL: Validate upload URL structure
      if (!uploadUrlInfo || !uploadUrlInfo.signedUrl || !uploadUrlInfo.fileName) {
        console.error(`CRITICAL: Invalid upload URL info for file ${i + 1}:`, uploadUrlInfo);
        throw new Error(`Invalid upload URL structure for file ${i + 1}`);
      }
      
      const { signedUrl, fileName } = uploadUrlInfo;

      console.log(`Uploading file ${i + 1}:`, {
        fileName: fileName,
        originalName: fileInfo.name,
        type: fileInfo.type,
        blobSize: fileInfo.blob.size,
        signedUrlExists: !!signedUrl,
      });

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": fileInfo.type,
        },
        body: fileInfo.blob,
      });

      console.log(`File ${i + 1} upload status:`, uploadRes.status);
      console.log(`File ${i + 1} upload ok:`, uploadRes.ok);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.log(`File ${i + 1} upload error:`, errorText);
        throw new Error(`Upload failed for ${fileInfo.name}: ${uploadRes.status} - ${errorText}`);
      }
      
      // CRITICAL: Ensure we're pushing the fileName correctly
      if (!fileName || fileName.trim() === '') {
        console.error(`CRITICAL: Empty fileName for file ${i + 1}`);
        throw new Error(`Server returned empty fileName for file ${i + 1}`);
      }
      
      uploadedFilePaths.push(fileName);
      console.log(`File ${i + 1} uploaded successfully as:`, fileName);
      console.log(`Current uploadedFilePaths array:`, uploadedFilePaths);
    }

    // FINAL VALIDATION
    console.log("Final validation in uploadFiles:");
    console.log("Expected file count:", fileInfoArray.length);
    console.log("Actual uploaded paths count:", uploadedFilePaths.length);
    console.log("All file paths:", uploadedFilePaths);
    
    if (uploadedFilePaths.length !== fileInfoArray.length) {
      console.error("CRITICAL: Mismatch in uploaded file paths count");
      throw new Error(`Expected ${fileInfoArray.length} file paths but got ${uploadedFilePaths.length}`);
    }

    console.log("All files uploaded successfully. Final paths:", uploadedFilePaths);
    console.log("=== UPLOAD FILES FUNCTION END ===");
    return uploadedFilePaths;
  }

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImagesVideos([...imagesVideos, ...result.assets]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (!result.canceled) {
      setUploadedVideo(result.assets[0]);
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });
    if (!result.canceled) {
      setUploadedAudio(result.assets ? result.assets[0] : result);
    }
  };

  const removeMedia = (index: number) => {
    setImagesVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        Alert.alert("Error", "Please fill in title and description");
        return;
      }

      // Get user token
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      // Prepare all files for upload
      const filesToUpload: any[] = [];

      // Process images/videos from media picker
      for (const file of imagesVideos) {
        try {
          const blob = await uriToBlob(file.uri);
          const fileName = file.fileName || file.uri.split("/").pop() || `file_${Date.now()}`;
          
          filesToUpload.push({
            name: fileName,
            type: blob.type || (file.type === "video" ? "video/mp4" : "image/jpeg"),
            blob: blob,
          });
        } catch (error) {
          console.error("Error processing media file:", error);
          throw new Error(`Failed to process media file: ${file.fileName || "unknown"}`);
        }
      }

      // Process single video if selected
      if (uploadedVideo) {
        try {
          const blob = await uriToBlob(uploadedVideo.uri);
          const fileName = uploadedVideo.fileName || "video.mp4";
          
          filesToUpload.push({
            name: fileName,
            type: blob.type || "video/mp4",
            blob: blob,
          });
        } catch (error) {
          console.error("Error processing video file:", error);
          throw new Error("Failed to process video file");
        }
      }

      // Process single audio if selected
      if (uploadedAudio) {
        try {
          const blob = await uriToBlob(uploadedAudio.uri);
          const fileName = uploadedAudio.name || "audio.mp3";
          
          filesToUpload.push({
            name: fileName,
            type: blob.type || "audio/mpeg",
            blob: blob,
          });
        } catch (error) {
          console.error("Error processing audio file:", error);
          throw new Error("Failed to process audio file");
        }
      }

      let uploadedFilePaths: string[] = [];

      // Upload all files if any exist
      if (filesToUpload.length > 0) {
        try {
          console.log("Files to upload:", filesToUpload.length);
          uploadedFilePaths = await uploadFiles(filesToUpload, token);
          console.log("Upload successful, file paths:", uploadedFilePaths);
        } catch (error:any) {
          console.error("File upload error:", error);
          throw new Error(`File upload failed: ${error.message}`);
        }
      } else {
        console.log("No files to upload");
      }

      // Submit complaint data to backend
      const complaintRes = await fetch(`${API_URL}/api/user/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          filePaths: uploadedFilePaths,
        }),
      });

      if (!complaintRes.ok) {
        const errorData = await complaintRes.text();
        throw new Error(`Failed to submit complaint: ${complaintRes.status} - ${errorData}`);
      }

      Alert.alert("Success", "Complaint submitted successfully!");
      
      // Reset form
      setFormData({ title: "", description: "", department: "", location: "" });
      setImagesVideos([]);
      setUploadedVideo(null);
      setUploadedAudio(null);
      
    } catch (err: any) {
      console.error("Submit error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 bg-slate-50 p-5"
          contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        padding: 20,
        paddingBottom: 40, // <-- extra space for keyboard
      }}
      keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-2xl shadow-md p-6">
          <Text className="text-2xl font-bold mb-4 text-blue-600">
            Submit a Complaint
          </Text>

          {/* Title */}
          <Text className="mb-1 font-semibold">Issue Title</Text>
          <TextInput
            placeholder="Brief description of the issue"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          {/* Location */}
          <Text className="mb-1 font-semibold">Location</Text>
          <TextInput
            placeholder="Street address or landmark"
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          {/* Description */}
          <Text className="mb-1 font-semibold">Detailed Description</Text>
          <TextInput
            placeholder="Provide detailed information about the issue..."
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          {/* Department Dropdown */}
          <Text className="mb-1 font-semibold">Department</Text>
          <View className="border border-gray-300 rounded-lg mb-4">
            <Picker
              selectedValue={formData.department}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, department: itemValue })
              }
              style={{ height: 65 }}
              mode="dropdown"
            >
              <Picker.Item label="Roads" value="roads" />
              <Picker.Item label="Sanitation" value="sanitation" />
              <Picker.Item label="Street Lighting" value="lighting" />
              <Picker.Item label="Water & Drainage" value="water" />
              <Picker.Item label="Parks & Recreation" value="parks" />
            </Picker>
          </View>



          {/* Upload Photos & Videos */}
          <Text className="mb-2 font-semibold">Photo Evidence</Text>
          <TouchableOpacity
            onPress={pickMedia}
            className="flex-row items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 mb-4"
          >
            <Upload size={20} color="blue" />
            <Text className="ml-2 text-blue-600">Upload Photos/Videos</Text>
          </TouchableOpacity>

          {imagesVideos.length > 0 && (
            <ScrollView horizontal className="mb-4">
              {imagesVideos.map((file, index) => (
                <View key={index} className="relative mr-2">
                  <Image
                    source={{ uri: file.uri }}
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Video */}
          <Text className="mb-2 font-semibold">Upload Video (Optional)</Text>
          <TouchableOpacity
            onPress={pickVideo}
            className="flex-row items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 mb-4"
          >
            <Video size={20} color="blue" />
            <Text className="ml-2 text-blue-600">Upload Video</Text>
          </TouchableOpacity>
          {uploadedVideo && (
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm text-gray-600 flex-1">
                {uploadedVideo.fileName || "Video selected"}
              </Text>
              <TouchableOpacity
                onPress={() => setUploadedVideo(null)}
                className="bg-red-500 rounded-full p-1 ml-2"
              >
                <X size={12} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Audio */}
          <Text className="mb-2 font-semibold">Upload Audio (Optional)</Text>
          <TouchableOpacity
            onPress={pickAudio}
            className="flex-row items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 mb-4"
          >
            <Mic size={20} color="blue" />
            <Text className="ml-2 text-blue-600">Upload Audio</Text>
          </TouchableOpacity>
          {uploadedAudio && (
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm text-gray-600 flex-1">
                {uploadedAudio.name}
              </Text>
              <TouchableOpacity
                onPress={() => setUploadedAudio(null)}
                className="bg-red-500 rounded-full p-1 ml-2"
              >
                <X size={12} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`py-3 rounded-lg ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
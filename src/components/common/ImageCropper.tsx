import * as ImageManipulator from "expo-image-manipulator";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

interface ImageCropperProps {
  imageUri: string;
  onCropComplete: (croppedUri: string) => void;
  onCancel: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CROP_SIZE = screenWidth - 60;

export default function ImageCropper({
  imageUri,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const [imageLayout, setImageLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const imageRef = React.useRef<View>(null);

  React.useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      setImageSize({ width, height });
      
      // Calculate initial scale to fit image
      const scaleX = CROP_SIZE / width;
      const scaleY = CROP_SIZE / height;
      const initialScale = Math.max(scaleX, scaleY);
      
      setScale(initialScale);
    });
  }, [imageUri]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: () => {
      translateX.setOffset(position.x);
      translateY.setOffset(position.y);
      translateX.setValue(0);
      translateY.setValue(0);
    },
    
    onPanResponderMove: Animated.event(
      [null, { dx: translateX, dy: translateY }],
      { useNativeDriver: false }
    ),
    
    onPanResponderRelease: (_, gesture) => {
      const newX = position.x + gesture.dx;
      const newY = position.y + gesture.dy;
      
      setPosition({ x: newX, y: newY });
      
      translateX.flattenOffset();
      translateY.flattenOffset();
    },
  });

  const handleZoom = (direction: "in" | "out") => {
    const newScale = direction === "in" 
      ? Math.min(scale * 1.1, 4) 
      : Math.max(scale / 1.1, 0.3);
    
    setScale(newScale);
  };

  const handleCrop = async () => {
    if (!imageSize.width || !imageLayout.width) return;
    
    setIsProcessing(true);
    
    try {
      // Get crop frame bounds (centered on screen)
      const cropFrameX = (screenWidth - CROP_SIZE) / 2;
      const cropFrameY = (screenHeight - CROP_SIZE) / 2;
      
      // Calculate displayed image dimensions
      const displayedWidth = imageLayout.width * scale;
      const displayedHeight = imageLayout.height * scale;
      
      // Calculate image position on screen (including transforms)
      const imageScreenX = imageLayout.x + position.x + (imageLayout.width - displayedWidth) / 2;
      const imageScreenY = imageLayout.y + position.y + (imageLayout.height - displayedHeight) / 2;
      
      // Calculate crop area relative to original image
      const scaleRatio = imageSize.width / displayedWidth;
      
      const cropX = Math.max(0, (cropFrameX - imageScreenX) * scaleRatio);
      const cropY = Math.max(0, (cropFrameY - imageScreenY) * scaleRatio);
      const cropWidth = Math.min(CROP_SIZE * scaleRatio, imageSize.width - cropX);
      const cropHeight = Math.min(CROP_SIZE * scaleRatio, imageSize.height - cropY);
      
      // Validate crop dimensions
      if (cropWidth <= 0 || cropHeight <= 0) {
        throw new Error('Invalid crop area');
      }

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(cropWidth),
              height: Math.round(cropHeight),
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      Toast.show({
        type: "success",
        text1: "Image Cropped",
        text2: "Ready for upload",
        visibilityTime: 1500,
      });

      onCropComplete(result.uri);
    } catch (error) {
      console.error("Crop error:", error);
      Toast.show({
        type: "error",
        text1: "Crop Failed",
        text2: "Please try again",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Animated.View
          ref={imageRef}
          style={[
            styles.imageWrapper,
            {
              transform: [
                { translateX },
                { translateY },
                { scale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setImageLayout({ x, y, width, height });
          }}
        >
          <Image 
            source={{ uri: imageUri }} 
            style={[
              styles.image,
              {
                width: imageSize.width,
                height: imageSize.height,
              }
            ]}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Crop Frame */}
        <View style={styles.cropFrame} pointerEvents="none" />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Text style={styles.instruction}>Drag image to position • Use zoom controls</Text>
        
        <View style={styles.zoomRow}>
          <TouchableOpacity 
            style={styles.zoomBtn} 
            onPress={() => handleZoom("out")}
          >
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
          
          <Text style={styles.scaleText}>{Math.round(scale * 100)}%</Text>
          
          <TouchableOpacity 
            style={styles.zoomBtn} 
            onPress={() => handleZoom("in")}
          >
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cropBtn, isProcessing && styles.disabled]} 
            onPress={handleCrop}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.cropText}>Crop & Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: screenWidth * 2,
    maxHeight: screenHeight * 2,
  },
  cropFrame: {
    position: "absolute",
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderWidth: 3,
    borderColor: "#4CAF50",
    backgroundColor: "transparent",
  },
  controls: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  instruction: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  zoomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  zoomText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scaleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#555",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cropBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cropText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
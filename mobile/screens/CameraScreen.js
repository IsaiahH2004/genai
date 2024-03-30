import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageManipulator from 'expo-image-manipulator';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const screenWidth = Dimensions.get('window').width;
const cameraSizeWidth = screenWidth * 0.9;
const cameraSizeHeight = screenWidth * 1.5;
const cameraSize = screenWidth * 0.9;
const cameraViewSize = screenWidth * 0.9;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);

      const cropWidth = Math.min(data.width, data.height);
      const cropHeight = cropWidth;
      const cropOriginX = (data.width - cropWidth) / 2;
      const cropOriginY = (data.height - cropHeight) / 2;

      const resizedImage = await ImageManipulator.manipulateAsync(
        data.uri,
        [
          { crop: { originX: cropOriginX, originY: cropOriginY, width: cropWidth, height: cropHeight } },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.cameraContainer, { width: cameraViewSize, height: cameraViewSize }]}>
        <Camera
          style={StyleSheet.absoluteFill}
          type={Camera.Constants.Type.back}
        />
      </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
          >
            <Text style={styles.text}> Take Photo </Text>
          </TouchableOpacity>
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#312244",
  },
  cameraContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    alignSelf: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  disposeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#9147ff",
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  profileName: {
    fontSize: 18,
    color: "white",
    paddingRight: 8,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
});

export default CameraScreen;
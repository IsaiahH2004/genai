import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import Ionicons from 'react-native-vector-icons/Ionicons';


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
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    console.log("here1");
    if (cameraRef.current) {
      console.log("here2");
      try {
        const options = { quality: 0.5, base64: true };
        console.log("here3");
        const data = await cameraRef.current.takePictureAsync(options);
        console.log("here4");
        const resizedImage = await ImageManipulator.manipulateAsync(
          data.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        console.log(resizedImage);

        fetch(`https://long-planets-think.loca.lt/steps/get`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: resizedImage,
          }),
        });
        console.log(`https://long-planets-think.loca.lt/steps/get`);
      } catch (error) {
        console.log("Error", "Failed to take picture: " + error.message);
      }
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
        ref={cameraRef}
        style={[styles.cameraContainer, { width: cameraSizeWidth, height: cameraSizeHeight }]}
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
  button:{
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
});

export default CameraScreen;
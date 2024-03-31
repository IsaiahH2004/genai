import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import ItemScreen from "./screens/ItemScreen";
import CameraScreen from "./screens/CameraScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import CheckList from "./screens/ChecklistScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tasks") {
            iconName = focused ? "list" : "list-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function TaskNavigator() {
  return (
    <Stack.Navigator initialRouteName="Item Screen">
      <Stack.Screen
        name="Item Screen"
        component={ItemScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckList"
        component={CheckList}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [initialRoute, setInitialRoute] = useState("Loading");

  useEffect(() => {
    const checkName = async () => {
      const storedName = await AsyncStorage.getItem("Name");
      setInitialRoute(storedName ? "MainApp" : "Welcome");
    };

    checkName();
  }, []);

  if (initialRoute === "Loading") {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={HomeTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

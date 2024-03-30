import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import TasksScreen from './screens/ItemScreen';
import CameraScreen from './screens/CameraScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckList from './screens/ChecklistScreen';
import ItemScreen from './screens/ItemScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator >
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="TasksScreen" component={ItemScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="CheckList" component={CheckList} options={{ headerShown: false }}/>
    
</Stack.Navigator>

  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }}/>
        <Tab.Screen name="Tasks" component={TasksScreen} options={{ headerShown: false }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;



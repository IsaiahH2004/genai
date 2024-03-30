import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <HomeScreen/>
  );
}


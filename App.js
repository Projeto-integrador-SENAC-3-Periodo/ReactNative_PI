import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreens';
import EnviarScreen from './src/screens/EnviarScreen';
import HorasScreen from './src/screens/HorasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EsqueceusenhaScreen from './src/screens/EsqueceusenhaScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'grid';
          } else if (route.name === 'Enviar') {
            iconName = 'cloud-upload';
          } else if (route.name === 'Horas') {
            iconName = 'time';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: '#F37021',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Enviar"
        component={EnviarScreen}
      />

      <Tab.Screen
        name="Horas"
        component={HorasScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Esqueceusenha"
          component={EsqueceusenhaScreen}
        />

        <Stack.Screen
          name="Home"
          component={TabRoutes}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
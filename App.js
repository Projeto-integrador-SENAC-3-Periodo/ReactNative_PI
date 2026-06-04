import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HorasScreen from './src/screens/HorasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EnviarScreen from './src/screens/EnviarScreen';
import DashboardScreen from './src/screens/DashboardScreens';
import AtividadesScreen from './src/screens/AtividadesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ color, size }) => {
            let iconName = 'ellipse';

            if (route.name === 'Dashboard') {
              iconName = 'grid';
            } else if (route.name === 'Atividades') {
              iconName = 'list';
            } else if (route.name === 'Enviar') {
              iconName = 'cloud-upload'; // ícone de upload
            } else if (route.name === 'Horas') {
              iconName = 'time';
            } else if (route.name === 'Perfil') {
              iconName = 'person';
            }

            return (
              <Ionicons name={iconName} size={size} color={color} />
            );
          },

          tabBarActiveTintColor: '#F37021',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Atividades" component={AtividadesScreen} />
        <Tab.Screen name="Enviar" component={EnviarScreen} />
        <Tab.Screen name="Horas" component={HorasScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
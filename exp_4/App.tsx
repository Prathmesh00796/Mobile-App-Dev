import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import Login from './Login';
import Register from './Register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563EB',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Login',
          }}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            title: 'Register',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
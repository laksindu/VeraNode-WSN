import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import SignupScreen from './Screens/SignupScreen';
import ZoneSensor from './Screens/ZoneSensor';
import Config from './Screens/Config';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
      if (initializing) setInitializing(false);
    });

    // Unsubscribe when the component unmounts
    return unsubscribe;
  }, []);

  // Show nothing (or a spinner) while Firebase checks the login status
  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "HomeScreen" : "LoginScreen"}>
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="LoginScreen" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="HomeScreen" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="SignupScreen" 
          component={SignupScreen} 
        />
        <Stack.Screen
        options={{headerShown:false}}
        name='ZoneSensor'
        component={ZoneSensor}
        />
        <Stack.Screen options={{headerShown:false}} name='Config' component={Config}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;

const styles = StyleSheet.create({});
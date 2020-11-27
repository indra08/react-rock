import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, Register, Splash} from '../pages';
import { color } from 'react-native-reanimated';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Selamat datang" component={Splash} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login}  options={{color:'white', headerTintColor:'white'}}/>
      <Stack.Screen name="Register" component={Register} options={{color:'white', headerTintColor:'white'}}/>
    </Stack.Navigator>
  );
};

export default Router;
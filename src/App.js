import React from 'react';
import {DefaultTheme, DarkTheme, NavigationContainer} from '@react-navigation/native';
import { ImageBackground, Image, StyleSheet, Text, View } from "react-native";
import Router from './router';

import {
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const MyTheme = {
  dark: false,
  colors: {
    primary: '#000000',
    card: '#000000',
    text: '#ffffff',
  },
};

const App = () => {
    
  return (
        <NavigationContainer theme={MyTheme}>
            <Router />
        </NavigationContainer>
      );
};  

export default App;
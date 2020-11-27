import React from 'react';
import { ImageBackground, Image, StyleSheet, Text, View } from "react-native";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => (
    <View style={styles.container}>
      <ImageBackground source={require('./img/bg.png')} style={styles.image}>
          <View style={styles.centerInside}>
            <Image source={require('./img/logo.png')} style={styles.logo}/>
          </View>
      </ImageBackground>
    </View>
  );

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column"
    },
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
    logo: {
        justifyContent: "center",
        margin: 0,
        resizeMode: "contain"
      },
    centerInside: {
        alignItems: "center",
        alignContent: "center"
    },
    text: {
      color: "white",
      fontSize: 42,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "#000000a0"
    }
  });
  
export default App;
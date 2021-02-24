import React, { useEffect } from 'react';
import { ImageBackground, Image, StyleSheet, Text, View } from "react-native";

const Splash = ({navigation}) => {

    useEffect(() => {
      
      setTimeout(() => {
          navigation.replace('Login');
      }, 2000);
    }, []);

    return (
        <View style={styles.container}>
          <ImageBackground source={require('../../../img/bg.png')} style={styles.image}>
              <View style={styles.centerInside}>
                <Image source={require('../../../img/logo.png')} style={styles.logo}/>
              </View>
          </ImageBackground>
        </View>
      );
};

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
  

export default Splash;
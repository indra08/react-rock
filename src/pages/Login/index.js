import React, { useState, useEffect }  from 'react';
import { ImageBackground, Image, StyleSheet, Text, View, Alert, TextInput, SafeAreaView, ScrollView, label, Button} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from '../../Res';
import {StatusBar} from 'react-native';

import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin';
import { WEB_CLIENT_ID } from '../../utils/keys';
import size from '../../Res/size';

const height_proportion = '100%';
const width_content = '80%';
const content_height = 45;
const default_border = 5;
const default_padding = 10;
const small_padding = 5;
const button_height = 45;

const Login = ({navigation}) => {

    const [userInfo, setUserInfo] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);    
    const [value, onChangeText] = React.useState('');

    const handleGoTo = screen => {
      navigation.navigate(screen);
  };

    // konfigurasi google sign in
    useEffect(() => {
      configureGoogleSign();

      if(setIsLoggedIn){

        //Alert.alert(userInfo.user.givenName);
      }
    }, []);

    function configureGoogleSign() {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false
      });
    }

    async function signIn() {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        setUserInfo(userInfo);
        setError(null);
        setIsLoggedIn(true);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // when user cancels sign in process,
          Alert.alert('Process Cancelled');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // when in progress already
          Alert.alert('Process in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // when play services not available
          Alert.alert('Play services are not available');
        } else {
          // some other error
          Alert.alert('Something else went wrong... ', error.toString());
          console.log(error.toString());
          setError(error);
        }
      }
    }

    async function signOut() {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setIsLoggedIn(false);
      } catch (error) {
        Alert.alert('Something else went wrong... ', error.toString());
      }
    }

    async function getCurrentUserInfo() {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        setUserInfo(userInfo);
        
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          // when user hasn't signed in yet
          Alert.alert('Please Sign in');
          setIsLoggedIn(false);
        } else {
          Alert.alert('Something else went wrong... ', error.toString());
          setIsLoggedIn(false);
        }
      }
    }
    
    return (
      <ImageBackground source={require('../../../img/bg.png')} style={styles.image}>
      <SafeAreaView style={styles.container}>

          <View style={{
                  flex: 1, 
                  flexDirection:'column', 
                  justifyContent:'center'}}>

              <View style={{ 
                      flexDirection:'column', 
                      height: height_proportion}}>

                  <View style={{flex:0.35}}>
                      <Image source={require('../../../img/logo.png')} 
                        style={{
                            width:180,
                            height:100,
                            marginLeft: default_padding,
                            resizeMode: 'contain'}}/>
                  </View> 

                  <View style={{
                            flex:0.65,  
                            alignItems:'center'}}>
                      
                      <Text 
                          style={{ 
                            width: width_content,
                            color: 'white',
                            marginTop: 40,
                            marginBottom: 5,
                          }}
                      >No HP</Text>
                      
                      <View style={{ 
                            flexDirection:'row',
                            height: content_height, 
                            width: width_content,
                            backgroundColor: 'white',
                            borderRadius: default_border,
                            borderColor: 'gray', 
                            }}>

                            <Image source={require('../../../img/smartphone.png')}
                                style={{ 
                                  flex: 0.15,
                                  height: content_height - 20, 
                                  resizeMode:'contain',
                                  alignSelf: 'center',
                                }}
                            />

                            <TextInput
                              style={{ 
                                flex: 0.85,
                                paddingRight: default_padding,
                                paddingLeft: default_padding,
                                color: 'black',
                              }}
                            />

                      </View>

                      <Text 
                          style={{ 
                            width: width_content,
                            color: 'white',
                            marginTop: 20,
                            marginBottom: 5,
                          }}
                      >Password</Text>

                      <View style={{ 
                            flexDirection:'row',
                            height: content_height, 
                            width: width_content,
                            backgroundColor: 'white',
                            borderRadius: default_border,
                            borderColor: 'gray', 
                            }}>

                          <Image source={require('../../../img/password.png')}
                              style={{ 
                                flex: 0.15,
                                height: content_height - 20, 
                                resizeMode:'contain',
                                alignSelf: 'center',
                              }}
                          />

                          <TextInput
                            secureTextEntry={true}
                            password={true} 
                            style={{ 
                              flex: 0.85,
                              paddingRight: default_padding,
                              paddingLeft: default_padding,
                              color: 'black',
                            }}
                          />
                      </View>
                      
                      <Text 
                          style={{ 
                            width: width_content,
                            color: '#C9A95F',
                            marginTop: 10,
                            marginBottom: 5,
                          }}
                      >Lupa Password</Text>

                      <View 
                          style={{ 
                            width: '50%',
                            height: button_height, 
                            backgroundColor: '#C9A95F',
                            borderRadius: default_border,
                            borderColor: 'gray', 
                            marginTop: 20,
                            marginBottom: 5,
                            
                          }}
                      >
                        <TouchableOpacity
                            style={{ 
                              alignSelf:'stretch',
                              height: '100%',
                              justifyContent:'center',
                              }}
                            onPress={() => {}} 
                          >
                            <Text 
                            style={{
                              color: 'white',
                              fontSize: 16,
                              alignSelf:'center',
                              }}>
                                LOGIN</Text>
                          </TouchableOpacity>
                      </View>

                      <Text 
                          style={{ 
                            width: width_content,
                            textAlign:'center',
                            color: 'white',
                            marginTop: 10,
                            marginBottom: 5,
                          }}
                      >atau login dengan menggunakan akun</Text>

                      <View 
                          style={{ 
                            flexDirection:'row',
                            width: width_content,
                            height: button_height, 
                            backgroundColor: '#A80202',
                            borderRadius: default_border,
                            borderColor: 'gray', 
                            marginTop: 20,
                            marginBottom: 5,
                            
                          }}
                      >

                        <Image source={require('../../../img/googleicon.png')}
                                style={{ 
                                  flex: 0.15,
                                  height: content_height - 24, 
                                  resizeMode:'contain',
                                  alignSelf: 'center',
                                }}
                            />
                          
                        <View
                          style={{ 
                            flex: 0.85,
                            alignSelf:'stretch',
                            height: '100%',
                            }}
                          onPress={() => {}} 
                        >
                          <TouchableOpacity
                            style={{ 
                              alignSelf:'stretch',
                              height: '100%',
                              justifyContent:'center',
                              }}
                            onPress={() => {

                              signIn()
                            }} 
                          >
                            <Text 
                            style={{
                              color: 'white',
                              fontSize: 16,
                              alignSelf:'center',
                              paddingRight: content_height - 24, 
                              }}>
                                Google</Text>
                          </TouchableOpacity>
                        </View>
                        
                      </View>

                      <View
                          style={{
                            flexDirection:'row',
                            width: width_content,
                            justifyContent: 'center',
                          }}
                        >

                        <Text 
                          style={{
                            color: 'white',
                            marginTop: 10,
                            marginBottom: 5,
                          }}
                        >Belum punya akun </Text>

                        <TouchableOpacity
                          onPress={() => {

                            handleGoTo('Register');
                          }} 
                        >

                          <Text 
                            style={{
                              color: '#C9A95F',
                              marginTop: 10,
                              marginBottom: 5,
                            }}
                          >Daftar Sekarang</Text>
                        </TouchableOpacity>
                        

                      </View>

                  </View> 
              </View>
          </View>
      </SafeAreaView>
      </ImageBackground>  
      );
};

const ActionButton = () => {

  return (
      <View>
          <TouchableOpacity
              style={{
                  backgroundColor:'#C9A95F',
                  borderRadius: 4,
                  paddingVertical: 10,
              }}
          >
              <Text
                  style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'white',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      marginLeft: 20,
                      marginRight: 20,
                  }}
              >
                  Login
              </Text>
          </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight,
    },
    scrollView: {
      marginHorizontal: 16,
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
  

export default Login;
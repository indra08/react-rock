import React from 'react';
import {DefaultTheme, DarkTheme, NavigationContainer} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/stack';
import { ImageBackground, Image, StyleSheet, Text, View , Alert} from "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Splash from '../src/pages/Splash';
import Home from '../src/pages/Home';
import DetailIklan from '../src/pages/Home/DetailIklan';
import Profile from '../src/pages/Profile';
import Otp from '../src/pages/Register/Otp';
import ResetPassword from '../src/pages/Register/ResetPassword';
import OtpResetPassword from '../src/pages/Register/OtpResetPassword';
import FormResetPassword from '../src/pages/Register/FormResetPassword';
import UbahProfile from '../src/pages/Profile/UbahProfile';
import Notif from '../src/pages/Notif';
import DetailNotif from '../src/pages/Notif/DetailNotif';
import Persembahan from '../src/pages/Persembahan';
import Merchandise from '../src/pages/Merchandise';
import ChangePassword from '../src/pages/Profile/ChangePassword';
import DetailMerchandise from '../src/pages/Merchandise/DetailMerchandise';
import DetailIbadah from '../src/pages/Ibadah/DetailIbadah';

const Stack = createStackNavigator();

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
            <Stack.Navigator>
              <Stack.Screen name="Selamat datang" component={Splash} options={{headerShown: false, animationEnabled:true}} />
              <Stack.Screen name="Login" component={Login} options={{headerShown: false, animationEnabled:true}}/>
              <Stack.Screen name="Register" component={Register} options={{color:'white', headerTintColor:'white', animationEnabled:true}}/>
              <Stack.Screen name="ResetPassword" component={ResetPassword} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Reset Password'}}/>
              <Stack.Screen name="OtpResetPassword" component={OtpResetPassword} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'OTP Reset Password'}}/>
              <Stack.Screen name="FormResetPassword" component={FormResetPassword} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Reset Password'}}/>
              <Stack.Screen name="Otp" component={Otp} options={{color:'white', headerTintColor:'white', animationEnabled:true},
              ({navigation, route}) => ({
                  headerLeft: () => (
                    <HeaderBackButton
                      onPress={() => {
                        Alert.alert("Konfirmasi","Apakah anda yakin ingin kembali?", [
                          {
                            text: "Cancel",
                            onPress: () => null,
                            style: "cancel"
                          },
                          { text: "YES", onPress: () => {
                                navigation.replace('Login');
                          }}
                        ]);
                      }}
                    />
                  ),
            })
            }/>
              <Stack.Screen name="Home" component={Home} options={{headerShown: false, animationTypeForReplace: 'push', animationEnabled:true}}/>
              <Stack.Screen name="DetailIklan" component={DetailIklan} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Detail Iklan'}}/>
              <Stack.Screen name="Profile" component={Profile}
              options={{headerShown: false, animationEnabled:true}, 
                ({navigation, route}) => ({
                  headerLeft: () => (
                    <HeaderBackButton
                      onPress={() => {
                        
                        navigation.replace('Home');
                      }}
                    />
                  ),
                })
              }/>
              <Stack.Screen name="UbahProfile" component={UbahProfile} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Ubah Profil'}}/>
              <Stack.Screen name="Notif" component={Notif} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Notifikasi'}}/>
              <Stack.Screen name="DetailNotif" component={DetailNotif} options={{ color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Detail Notifikasi'}}/>
              <Stack.Screen name="Persembahan" component={Persembahan} options={{color:'white', headerTintColor:'white' ,animationEnabled:true, headerTitle:'Persembahan'}}/>
              <Stack.Screen name="Merchandise" component={Merchandise} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Merchandise'}}/>
              <Stack.Screen name="ChangePassword" component={ChangePassword} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Ubah Password'}}/>
              <Stack.Screen name="DetailMerchandise" component={DetailMerchandise} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Detail Merchandise'}}/>
              <Stack.Screen name="DetailIbadah" component={DetailIbadah} options={{color:'white', headerTintColor:'white', animationEnabled:true, headerTitle:'Pesan Kursi'}}/>
            </Stack.Navigator>
        </NavigationContainer>
      );
};  

export default App;
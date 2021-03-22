import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    Image, 
    StyleSheet, 
    Text, 
    View, 
    Platform,
    Dimensions,
    BackHandler,
    TouchableOpacity,
    ImageBackground,
    Alert,
 } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../Home/HomeScreen";
import Ibadah from "../Home/Ibadah";
import Tiket from "../Home/Tiket";
import Event from "../Home/Event";
import Video from "../Home/Video";
import messaging from '@react-native-firebase/messaging';

import TextTicker from 'react-native-text-ticker';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
var onProcess = false;

const Tab = createBottomTabNavigator();

const IconBottom = (props) => {
    const { color, focused } = props.data
    let colorSelected = focused ? color : 'grey'
    return (
        <View>
            <Image source={props.image} style={{ width: 26, height: 26, tintColor: colorSelected }} />
        </View>
    )
}

const Home = ({route, navigation}) => {

    const [jumlahNotif, setJumlahNotif] = useState(0);
    const [runningText, setRunningText] = useState(''); 

    useEffect(() => {

        requestUserPermission();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
        });
        
        getRunningText();
        getJumlahNotif();

        // Handling Back press
        const backAction = () => {
            Alert.alert("Konfirmasi","Apakah anda yakin ingin keluar?", [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => {
                  BackHandler.exitApp() ;
              }}
            ]);
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => {
            backHandler.remove();
            unsubscribe;
          };
    }, []);

    requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        getFcmToken();
        console.log('Authorization status:', authStatus);
      }
    }

    getFcmToken = async () => {
      
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
       console.log("Your Firebase Token is:", fcmToken);
       updateFCM(fcmToken);
      } else {
       console.log("Failed", "No token received");
      }
    }

    const updateFCM = async (token) => {

      onProcess = true; 
      const param = {
        fcm_id: token,
      };
  
      await Api.post('/account/update_fcm_id', param)
        .then( async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
  
          if(metadata.status == 200){     
            
          }

          onProcess = false;
        })
        .catch((error) => {
          console.log(error);
          onProcess = false;
        });
    };

    const getRunningText = async () => {
  
        await Api.get('/Runtext/get_text')
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                  var text = respon.text;
                  setRunningText(text);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };
  
      const getJumlahNotif = async () => {
  
        await Api.get('/notification/get_notif_badge')
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                setJumlahNotif(respon.value);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };

    return (

        <SafeAreaView style={{flex:1, backgroundColor:color.grey}}>
            <ImageBackground source={require('../../../img/bg.png')} style={styles.imageBackground}>
                {/* Bagian atas */}
                <View style={styles.centerInside}>
                    <Image source={require('../../../img/logo.png')} style={styles.logo}/>
                    <View 
                      style={{
                            flex:1,
                            flexDirection: "row-reverse",
                            width: '60%',
                          }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Profile');
                        }}>
                          <Image source={require('../../../img/profile.png')} 
                            style={{
                              width:40,
                              height:40,
                            }}/>
                      </TouchableOpacity>     

                      <TouchableOpacity
                        
                        onPress={()=>{
                          navigation.navigate('Notif');
                        }}
                      >
                          <Image source={require('../../../img/notif.png')} 
                            style={{
                              width:40,
                              height:40,
                              marginRight:15,
                            }}/>

                            {jumlahNotif > 0 && 

                                <View
                                  style={{
                                    width:24,
                                    height:24,
                                    backgroundColor: 'red',
                                    color:'white',
                                    justifyContent:'center',
                                    borderRadius:12,
                                    alignItems:'center',
                                    alignContent:'center',
                                    position:'absolute',
                                    right:10,
                                    top:-10,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color:'white',
                                      fontSize:10,
                                    }}
                                  >{jumlahNotif}</Text>
                                </View>
                                
                            }
                      </TouchableOpacity>     
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "column",
                      marginTop:10,
                      paddingLeft:size.padding_big,
                      paddingRight:size.padding_big,
                      backgroundColor:"#F3F3F3",
                      borderTopLeftRadius:26,
                      borderTopRightRadius:26,
                    }}
                  >

                        <TextTicker
                          style={{ 
                            color: color.dark_gold,
                            fontSize: 18,
                            marginTop:size.padding_big,
                            marginLeft:size.padding_default,
                            marginRight:size.padding_default,
                            marginBottom:size.padding_default,
                          }}
                          duration={7000}
                          autoplayLoop
                          bounce
                          repeatSpacer={10}
                          marqueeDelay={1000}
                        >
                          {runningText}
                      </TextTicker>

                  </View>

            </ImageBackground>

            <Tab.Navigator
                stateTab={2}
                tabBarOptions={{
                    //other properties
                      pressColor: 'gray',
                      activeTintColor:'#C59D46',
                      activeBackgroundColor:'white',
                      style: {
                      backgroundColor: 'white',
                      //height: Platform.OS === 'android' ? 55 : 82,
                      height : win.height / 11,
                      borderColor: 'transparent',
                      paddingBottom:size.padding_default,
                    }
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} 
                        options={{
                            color:'red', 
                            headerTintColor:'red',
                            tabBarIcon: (props) => (
                                <IconBottom data={props} image={require('../../../img/homegold.png')} />
                            )
                    }}/>
                <Tab.Screen name="Ibadah" component={Ibadah} 
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/ibadahgold.png')} />
                        )
                    }}
                />
                <Tab.Screen name="Tiket" component={Tiket}
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/tiketgold.png')} />
                        )
                    }}
                />
                <Tab.Screen name="Event" component={Event} 
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/eventgold.png')} />
                        )
                    }}
                />
                <Tab.Screen name="Video" component={Video} 
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/videogold.png')} />
                        )
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column"
    },
    imageBackground: {
        resizeMode: "cover",
      },
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
    logo: {
        justifyContent: "center",
        width:'40%',
        height: 50,
        resizeMode: "contain"
      },
    centerInside: {
        flexDirection: "row",
        alignItems: "flex-start",
        alignContent: "flex-start",
        paddingTop: size.save_area,
        paddingRight: size.save_area,
        paddingLeft: size.save_area,
    }
  });
  

export default Home;
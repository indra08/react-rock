import React, { useEffect } from 'react';
import { SafeAreaView, Image, StyleSheet, Text, View, Platform } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../Home/HomeScreen";

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

const Home = ({navigation}) => {

    useEffect(() =>{

 
    });

    return (
        <SafeAreaView style={{flex:1}}>
            <Tab.Navigator
                
                tabBarOptions={{
                    //other properties
                    pressColor: 'gray',
                    activeTintColor:'#C59D46',
                    activeBackgroundColor:'white',
                    style: {
                    backgroundColor: 'white',
                    height: Platform.OS === 'android' ? 55 : 82,
                    borderColor: 'transparent'
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
                <Tab.Screen name="Ibadah" component={HomeScreen} 
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/ibadahgold.png')} />
                        )
                    }}
                />
                <Tab.Screen name="Tiket" component={HomeScreen} 
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/tiketgold.png')} />
                        )
                    }}
                />
                <Tab.Screen name="Event" component={HomeScreen} 
                    options={{
                        color:'red', 
                        headerTintColor:'red',
                        tabBarIcon: (props) => (
                            <IconBottom data={props} image={require('../../../img/eventgold.png')} />
                        )
                    }}
                />
                <Tab.Screen name="Video" component={HomeScreen} 
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
    }
  });
  

export default Home;
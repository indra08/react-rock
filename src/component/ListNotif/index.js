import React from 'react';
import {Image, StyleSheet, Text, Dimensions,View, TouchableOpacity, Linking} from 'react-native';

const win = Dimensions.get('window');

const ListNotif = ({id, title, notif, date, hour}) => {
    return (
        <TouchableOpacity 
                style={{
                    width:'100%',
                    height:50,
                    backgroundColor:'red',
                }}
                onPress={() => {
                    
                }}>
                    <View
                        style={{
                            flexDirection:'column',
                        }}
                    >

                        <View
                            style={{
                                flexDirection:'row',
                            }}
                        >

                                <Text
                                    style={{
                                        flex:0.7,
                                        color:'black',
                                        fontSize:20,
                                    }}
                                >
                                    {title}
                                </Text>

                                <Text
                                    style={{
                                        flex:0.3,
                                        color:'black',
                                        fontSize:20,
                                    }}
                                >
                                    {date +" "+ hour}
                                </Text>
                        </View>

                    </View>
        </TouchableOpacity>
    );
  };
  
  export default ListNotif;

  const styles = StyleSheet.create({
    
    
  });
  
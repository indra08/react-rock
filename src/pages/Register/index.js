import React, { useState, useEffect } from 'react';
import { Image ,ImageBackground, TextInput, StyleSheet, Text, View, ScrollView } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions } from "react-navigation";
import size from '../../Res/size';
import PasswordInputText from 'react-native-hide-show-password-input';
 
const Register = ({navigation}) => {

    const handleGoTo = screen => {
        navigation.navigate(screen);
    };

    return (
        <ScrollView style={styles.scrollView}>
              <View style={styles.container}>

                    <View style={{alignItems:'center', marginTop: 40,}}>
                            <Text 
                                style={styles.lable}
                            >Nama Lengkap</Text>

                            <TextInput
                              style={styles.textInput}
                            />
                    </View>

                    <View style={{ alignItems:'center', marginTop: 20,}}>
                            <Text 
                                style={styles.lable}
                            >No. HP</Text>

                            <TextInput
                              style={styles.textInput}
                            />
                    </View>

                    <View style={{ alignItems:'center', marginTop: 20,}}>
                            <Text 
                                style={styles.lable}
                            >Alamat</Text>

                            <TextInput
                              multiline={true}
                              style={styles.textArea}
                            />
                    </View>

                    <View style={{alignItems:'center', marginTop: 20,}}>

                        <View style={{width:'80%'}}>

                        <Text 
                                style={styles.lable}
                            >Password</Text>

                            <View
                              style={{
                                flexDirection:'row',
                                borderWidth: 1, 
                                borderRadius: size.border_radius,
                                borderColor: 'grey',
                              }}
                            >
                              <TextInput
                                secureTextEntry={true}
                                password={true} 
                                style={styles.textInput2}
                              />

                              <TouchableOpacity
                                  style = {{
                                    flex:0.15,
                                    alignContent:'center',
                                  }}
                              >
                                
                                <Image source={require('../../../img/matabuka.png')}
                                                              style={{ 
                                                                width:35,
                                                                height:35,
                                                                resizeMode:'center',
                                                                alignSelf: 'center',
                                                                marginRight: 10,
                                                              }}
                                                          />
                              </TouchableOpacity>
                              
                            </View>
                        </View>
                            
                    </View>
              </View>
        </ScrollView> 
      );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor:'white',
  },
  container: {
    flex: 1,
    flexDirection: "column"
  },
  lable:{
    width: size.width_content,
    color: 'black',
    marginBottom: 5,
  },
  textInput: {
    width: size.width_content,
    padding: size.medium_padding,
    color: 'black',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: size.border_radius,
  },
  textInput2: {
    flex: 1,
    padding: size.medium_padding,
    color: 'black',
  },
  textArea: {
    width: size.width_content,
    height: 90,
    justifyContent: "flex-start",
    padding: size.medium_padding,
    color: 'black',
    borderColor: 'grey',
    borderWidth: 1, 
    borderRadius: size.border_radius,
  }
});

export default Register;
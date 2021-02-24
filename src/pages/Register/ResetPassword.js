import React, { useEffect, useState, useRef} from 'react';
import { 
    ScrollView, 
    TextInput, 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
 } from "react-native";
import Api from '../../api';
import RepoUtil from '../../helper/RepoUtil';
const size = require('../../Res/size');
const color = require('../../Res/color');

const ResetPassword = ({route, navigation}) => {

    const [username, setUsername] = useState('');
    const [isProcess, setProcess] = useState(false);
    
    useEffect(() =>{

    }, []);

    const otpAction = async () => {
    
        setProcess(true);
  
        const param = {
              type             :'reset_pass',
              nohp             :username,
        };
    
        await Api.post('auth/phone_validation', param)
    
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
          setProcess(false);
  
          if(metadata.status == 200){
  
            navigation.navigate('OtpResetPassword', {no_hp :username});
          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          setProcess(false);
        });
        
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <Text 
                    style={styles.lable}
                        >Masukkan Nomor HP </Text>

                <View style={{ 
                        flexDirection:'row',
                        height: size.content_height, 
                        width: '100%',
                        marginTop: size.padding_default,
                        backgroundColor: color.grey,
                        borderRadius: size.default_border,
                        borderColor: 'gray', 
                        }}>

                        <Image source={require('../../../img/smartphone.png')}
                            style={{ 
                              flex: 0.15,
                              height: size.content_height - 20, 
                              resizeMode:'contain',
                              alignSelf: 'center',
                            }}
                        />

                        <TextInput
                          placeholder="No. HP"
                          style={{ 
                            flex: 0.85,
                            paddingRight: size.default_padding,
                            paddingLeft: size.default_padding,
                            color: 'black',
                          }}
                          keyboardType='phone-pad'
                          value={username}
                          onChangeText={(value) => setUsername(value)}
                        />

                </View>
                
                <View 
                          style={{ 
                            width: '50%',
                            marginTop:40,
                            height: size.button_height, 
                            backgroundColor: '#C9A95F',
                            borderRadius: size.default_border,
                            borderColor: 'gray', 
                            alignSelf:'center',
                            marginBottom: 5,
                            
                          }}
                      >

                    <TouchableOpacity
                                style={{ 
                                alignSelf:'stretch',
                                height: '100%',
                                justifyContent:'center',
                                }}
                                onPress={() => {
                                    otpAction();
                                }} 
                            >
                                <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    Kirim</Text>
                    </TouchableOpacity>
                </View>
                    
            </ScrollView>
          
        </SafeAreaView>
        
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      padding:size.default_padding,
      backgroundColor:'white',
    },
    ScrollView:{
        padding:size.padding_big,
    },
    lable:{
        width: '100%',
        color: 'black',
        marginBottom: 5,
        borderWidth:0,
        fontSize:16,
    },
    lable2:{
        color: 'black',
        marginBottom: 5,
        borderWidth:0,
        fontSize:14,
        textAlign:'center'
    },
    textOtp:{
        flex:1,
        borderBottomWidth: 1,
        marginLeft:size.padding_default,
        marginRight:size.default_padding,
        fontSize:40,
        textAlign:'center',
    },
  });
  

export default ResetPassword;
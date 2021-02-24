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

const FormResetPassword = ({route, navigation}) => {

    const [username, setUsername] = useState('');
    const [isProcess, setProcess] = useState(false);
    const [password, setPassword] = useState('');
    const [isSecure, setSecure] = useState(true);
    const [repassword, setRePassword] = useState('');
    const [isReSecure, setReSecure] = useState(true);
    const { uid } = route.params;
    
    useEffect(() =>{

    }, []);

    const resetPassword = async () => {
    
        setProcess(true);
  
        const param = {
              uid               : uid,
              newpassword       : password,
              retype_newpassword: repassword,
        };
    
        await Api.post('auth/reset_password', param)
    
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
          setProcess(false);
  
          if(metadata.status == 200){
  
            Alert.alert("Pesan", metadata.message, [
                { text: "Ok", onPress: () => {
                      navigation.replace('Login');
                }}
              ]);
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
            <View style={{alignItems:'center', marginTop: 20,}}>

                <Text 
                        style={styles.lable}
                    >Password</Text>

                <View style={styles.textInputPassword}>
                    
                    <TextInput
                        underlineColorAndroid="transparent"
                        value={password}
                        secureTextEntry={isSecure}
                        onChangeText={(value) => setPassword(value)}
                        style={{ 
                        flex: 0.97,
                        paddingRight: size.default_padding,
                        paddingLeft: size.default_padding,
                        color: 'black',
                        }}
                    />
                    
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.touachableButton}
                        onPress={() => setSecure(!isSecure)}>
                        <Image
                        source={
                            isSecure
                            ? require('../../../img/matabuka.png')
                            : require('../../../img/matatutup.png')
                        }
                        style={styles.buttonImage}
                        />
                    </TouchableOpacity>
                </View>
                </View>

                <View style={{alignItems:'center', marginTop: 20,}}>

                <Text 
                        style={styles.lable}
                    >Ketik Ulang Password</Text>

                    
                <View style={styles.textInputPassword}>
                    
                    <TextInput
                    underlineColorAndroid="transparent"
                    value={repassword}
                    secureTextEntry={isReSecure}
                    onChangeText={(value) => setRePassword(value)}
                    style={{ 
                        flex: 0.97,
                        paddingRight: size.default_padding,
                        paddingLeft: size.default_padding,
                        color: 'black',
                    }}
                    />
                    
                    <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.touachableButton}
                    onPress={() => setReSecure(!isReSecure)}>
                    <Image
                        source={
                        isReSecure
                            ? require('../../../img/matabuka.png')
                            : require('../../../img/matatutup.png')
                        }
                        style={styles.buttonImage}
                    />
                    </TouchableOpacity>
                </View>
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
                                    resetPassword();
                                }} 
                            >
                                <Text 
                                style={{
                                color: 'white',
                                fontSize: 16,
                                alignSelf:'center',
                                }}>
                                    Simpan</Text>
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
    textInputPassword: {
        width: '100%',
        color: 'black',
        borderColor: 'grey',
        borderWidth: 1, 
        borderRadius: size.border_radius,
        flexDirection:'row',
        height: size.content_height,
    },
    touachableButton: {
        height: 40,
        width: 35
    },
    buttonImage: {
        resizeMode: 'contain',
        height: '100%',
        width: '100%',
    },
  });
  

export default FormResetPassword;
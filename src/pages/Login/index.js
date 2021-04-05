import React, { useState, useEffect}  from 'react';
import { 
  ImageBackground, 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  TextInput, 
  SafeAreaView, 
  ScrollView, 
  label, 
  BackHandler,
  Platform,
} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from '../../Res';
import {StatusBar, Dimensions} from 'react-native';
import RepoUtil from '../../helper/RepoUtil';
import Api from '../../api';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin';
import { WEB_CLIENT_ID } from '../../utils/keys';
import size from '../../Res/size';
import jwt_decode from 'jwt-decode';

const height_proportion = '100%';
const width_content = '80%';
const content_height = 45;
const default_border = 5;
const default_padding = 10;
const small_padding = 5;
const button_height = 45;
const majorVersionIOS = parseInt(Platform.Version, 10);
let user = null;

async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
  if (user === null) {
    updateCredentialStateForUser('N/A');
  } else {
    const credentialState = await appleAuth.getCredentialStateForUser(user);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      updateCredentialStateForUser('AUTHORIZED');
    } else {
      updateCredentialStateForUser(credentialState);
    }
  }
}

const Login = ({navigation}) => {

    const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);    
    const [session, setSession] = useState(null);
    const [isProcess, setProcess] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSecure, setSecure] = useState(true);

    var userData = null;

    const loadSession = async () => {
      
      const dataRepo = await RepoUtil.GetAsObject('@session');
      setSession(dataRepo);
      
      if(dataRepo != null){
          // Jika sudah login
          navigation.replace('Home');
      }else{
          await signOut();
      }
    };

    const handleGoTo = screen => {
      navigation.navigate(screen);
    };

    // konfigurasi google sign in
    useEffect(() => {

      console.log("iOS version " + majorVersionIOS);
      configureGoogleSign();

      // Cek sudah login dari session
      loadSession();

      // Backpresshandler
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
        if (appleAuth.isSupported) {

          appleAuth.onCredentialRevoked(async () => {
            console.warn('Credential Revoked');
            fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
              updateCredentialStateForUser(`Error: ${error.code}`),
            );
          });
        }
      }

    }, []);

    function configureGoogleSign() {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false
      });
    }

    /**
     * Starts the Sign In flow.
     */
    async function onAppleButtonPress(updateCredentialStateForUser) {
      //console.warn('Beginning Apple Authentication');

      // start a login request
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        //console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        const {
          user : newUser,
          nonce,
          identityToken,
          realUserStatus /* etc */,
        } = appleAuthRequestResponse;

        const { email } = jwt_decode(appleAuthRequestResponse.identityToken);

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        console.log(appleAuthRequestResponse);
        loginAppleIdAction(newUser, '', email);

        //user = newUser;

        fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
          updateCredentialStateForUser(`Error: ${error.code}`),
        );

        if (identityToken) {
          // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
          //console.log(nonce, identityToken);
          
        } else {
          // no token - failed sign-in?
        }

        if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
          //console.log("I'm a real person!");
        }

        //console.warn(`Apple Authentication Completed, ${user}, ${email}`);
      } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
          //console.warn('User canceled Apple Sign in.');
        } else {
          console.error(error);
        }
      }
    }

    const signIn = async () => {

      try {

        await GoogleSignin.hasPlayServices();
        const info = await GoogleSignin.signIn();
        userData = info;

        loginAction();

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
          if (error.toString() != 'Error: SIGN_IN_REQUIRED'){
            // Alert.alert('Something else went wrong... ', error.toString()); 
          }
          setError(error);
        }
      }
    }

    const loginAction = async () => {
      
      if(userData != null){
        setProcess(true);
        const param = {
          uid: userData.user.id,
          nama: userData.user.name,
          email: userData.user.email
        };
    
        await Api.post('auth/login_email', param)
    
          .then(async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
  
            if(metadata.status == 200){
  
              const dataSession = {
                id_jemaat           :respon.id_jemaat,
                token               :respon.token,
                nama                :respon.nama,
                flag_profil_lengkap :respon.flag_profil_lengkap
              }
  
              // menyimpan session
              RepoUtil.StoreAsObject('@session', dataSession);
              navigation.replace('Home');
            }
          })
          .catch((error) => {
            
            setProcess(false);
          });
      }else{
        //await signIn();
      }
      
    };

    const loginAppleIdAction = async (uid,name,email) => {
      
      console.log('uid '+uid +" , email "+email);
      setProcess(true);
        const param = {
          uid: uid,
          nama: name,
          email: email
        };
    
        await Api.post('auth/login_email', param)
    
          .then(async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
  
            if(metadata.status == 200){
  
              const dataSession = {
                id_jemaat           :respon.id_jemaat,
                token               :respon.token,
                nama                :respon.nama,
                flag_profil_lengkap :respon.flag_profil_lengkap
              }
  
              // menyimpan session
              RepoUtil.StoreAsObject('@session', dataSession);
              navigation.replace('Home');
            }else{
              Alert.alert("Info",metadata.message, [
                {
                  text: "Ok",
                  onPress: () => null
                }
              ]);
            }
          })
          .catch((error) => {
            
            setProcess(false);
          });
      
    };

    const signInEmail = async() => {

      setProcess(true);
      const param = {
        no_hp   : username,
        password: password
      };
  
      await Api.post('auth/login', param)
  
        .then(async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;

          if(metadata.status == 200){

            const dataSession = {
              id_jemaat           :respon.id_jemaat,
              token               :respon.token,
              nama                :respon.nama,
              flag_profil_lengkap :respon.flag_profil_lengkap
            }

            // menyimpan session
            RepoUtil.StoreAsObject('@session', dataSession);
            navigation.replace('Home');
          }else{
            Alert.alert(metadata.message);
          }
        })
        .catch((error) => {
          
          setProcess(false);
        });
    };

    async function signOut() {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setIsLoggedIn(false);
      } catch (error) {
        if (error.toString() != 'Error: SIGN_IN_REQUIRED'){
          //Alert.alert('Something else went wrong... ', error.toString());
        }
        
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
          if (error.toString() != 'Error: SIGN_IN_REQUIRED'){
            //Alert.alert('Something else went wrong... ', error.toString());
          }
          setIsLoggedIn(false);
        }
      }
    }
    
    return (

      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../img/bg.png')} style={styles.image}>
        </ImageBackground>  

        <Image source={require('../../../img/logo.png')} 
              style={{
                  width:180,
                  height:100,
                  marginTop:20,
                  marginLeft: default_padding,
                  resizeMode: 'contain'}}/>

        <ScrollView style={styles.scrollView}>
          
          <View style={{
              marginTop:60,
              width:'100%',
              alignItems:'center',
          }}>
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
                    placeholder="No. HP"
                    style={{ 
                      flex: 0.85,
                      paddingRight: default_padding,
                      paddingLeft: default_padding,
                      color: 'black',
                    }}
                    keyboardType='phone-pad'
                    value={username}
                    onChangeText={(value) => setUsername(value)}
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
                      underlineColorAndroid="transparent"
                      placeholder="Password"
                      value={password}
                      secureTextEntry={isSecure}
                      onChangeText={(value) => setPassword(value)}
                      style={{ 
                        flex: 0.8,
                        paddingRight: default_padding,
                        paddingLeft: default_padding,
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
            
            <View
              style={{width:width_content}}
            >
              <TouchableOpacity
                style={{
                  width: width_content,
                }}
                onPress={()=>{
                    handleGoTo('ResetPassword');
                }}
              >

                <Text 
                    style={{ 
                      width: width_content,
                      color: '#C9A95F',
                      marginTop: 10,
                      marginBottom: 5,
                    }}
                >Lupa Password</Text>
              </TouchableOpacity>
            </View>
            
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
                  onPress={() => {

                    signInEmail();
                  }} 
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

            { (Platform.OS == 'ios' && majorVersionIOS > 12) && <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  flex:1,
                  marginTop: size.padding_big,
                  width: 160, // You must specify a width
                  height: 45, // You must specify a height
                }}
                onPress={() => onAppleButtonPress(updateCredentialStateForUser)}
                onSuccess={(response) => {
                  console.log(response);
                  // {
                  //     "authorization": {
                  //       "state": "[STATE]",
                  //       "code": "[CODE]",
                  //       "id_token": "[ID_TOKEN]"
                  //     },
                  //     "user": {
                  //       "email": "[EMAIL]",
                  //       "name": {
                  //         "firstName": "[FIRST_NAME]",
                  //         "lastName": "[LAST_NAME]"
                  //       }
                  //     }
                  // }
                }}
              />}

            <View 
                style={{ 
                  flexDirection:'row',
                  width: width_content,
                  height: button_height, 
                  backgroundColor: '#A80202',
                  borderRadius: default_border,
                  borderColor: 'gray', 
                  marginTop: size.padding_big,
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

                    signIn();
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
            
           <View
            style={{height:200}}
           >
             
           </View>

          </View>
        </ScrollView>
      </SafeAreaView>
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
      flexDirection:'column',
      //marginTop: StatusBar.currentHeight,
    },
    scrollView: {
      
    },
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      alignItems: 'center',
      left: 0,
      top: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      resizeMode: 'stretch',
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
  

export default Login;
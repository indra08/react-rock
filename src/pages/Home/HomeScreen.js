import React, { useState, useEffect } from 'react';
import { 
  ImageBackground, 
  Image,
  StyleSheet,
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  FlatList,
  BackHandler,
  Alert,
} from "react-native";
import TextTicker from 'react-native-text-ticker';
import ListVideo from "../../component/ListVideo";
import Api from '../../api';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { Pagination } from 'react-native-swiper-flatlist';

const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  
    const [runningText, setRunningText] = useState('');  
    const [video, setVideo] = useState([]);
    const [iklan, setIklan] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [length, setLength] = useState(5);
    const [isLast, setLast] = useState(false);
    const [refresh, setRefresh] = useState(false)

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

    const getListIklan = async () => {

      const param = {
        
      }; 
  
      await Api.post('/iklan/slider_iklan', param)
        .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
  
            if(metadata.status == 200){
  
              var dataIklan = [];
              respon.map((item)=>{
              
                dataIklan.push(
                  {
                    id       :item.id,
                    img_url  :item.img_url,
                  }
                );
  
              });
  
              await setIklan(dataIklan);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    };

    const getListVideo = async () => {

      console.log("dipanggil");
      
      const param = {
        start: offset,
        limit: length,
      };

      await Api.post('/video/list_video', param)
        .then( async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;

          if(metadata.status == 200){

            var dataVideo = [];
            respon.map((item)=>{
            
              dataVideo.push(
                {
                  id       :item.id,
                  img_url  :item.img_url,
                  link     :item.link,
                  title    :item.title
                }
              );
            });

            await setVideo(offset == 0 ? dataVideo : [...video, ...dataVideo]);
            await setOffset(dataVideo.length != 0 ? (offset + dataVideo.length) : offset);
            //console.warn('listFilm', offset);
            await setLast(dataVideo.length != length ? true : false);
            
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    
    useEffect(() => {
        
        getListVideo();
        getListIklan();
        getRunningText();

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
      
          return () => backHandler.remove();
    }, []);

    const loadMore = async() => {
      
      console.log('reach');
      if(isLast === false){
          //await setOffset(offset + length);
          //console.warn('loadMore', offset);
          await getListVideo();
      }
    }

    //#region Bagian video
    const renderItem = ({item}) => {
        return (
          <ListVideo
            key={item.id}
            title={item.title}
            img_url={item.img_url}
            link={item.link}
            id={item.id}
          />
        );
      };

    function renderPage(index){
        return (
          <View style={{
            width:'100%',
            height:(win.width *2/4),
            flexDirection:'row',
            paddingLeft:size.padding_default,
            paddingRight:size.padding_default,
            justifyContent:'center',
          }}>
            <Image 
              source={{uri: iklan[index].img_url}} 
              style={{
                width:'100%',
                height:'75%',
                borderRadius: size.radius_default,
              }}
            />
          </View>
        )
    }

    const renderItemIklan22 = iklan.map((it, idx) => {
          return renderPage(idx);
    });

    const renderItemIklan = ({item}) => {
      return (

        <TouchableOpacity
            onPress={()=>{

              navigation.navigate('DetailIklan', {id: item.id});
            }}
          >
            <View style={{
              
              width: win.width - 46,
              height:(win.width *2/4),
              flexDirection:'row',
              marginLeft:size.padding_default,
              marginRight:size.padding_default,
            }}>

              
                <Image 
                  source={{uri: item.img_url}} 
                  style={{
                    width:'100%',
                    height:'78%',
                    resizeMode:'cover',
                    borderRadius: size.radius_default,
                  }}
                />
              
            </View>
        </TouchableOpacity>
      );
    };
    //#endregion

    return (
        <SafeAreaView style={styles.container}>
          <ImageBackground source={require('../../../img/bg.png')} style={styles.imageBackground}>
              <View
                style={{
                  flex:1,
                  flexDirection:"column"
                }}>

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
                        
                      >
                          <Image source={require('../../../img/notif.png')} 
                            style={{
                              width:40,
                              height:40,
                              marginRight:15,
                            }}/>
                      </TouchableOpacity>     
                    </View>
                  </View>

                  {/* Bagian bawah */}
                  <View
                    style={{
                      flex:1,
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
                          }}
                          duration={7000}
                          autoplayLoop
                          bounce
                          repeatSpacer={10}
                          marqueeDelay={1000}
                        >
                          {runningText}
                      </TextTicker>

                      <ScrollView 
                        style={{
                          marginTop:size.default_padding
                        }}>

                        <View
                          style={{
                          }}
                        >

                          <View 
                            style={{
                              flex:1,
                              height:win.height / 4
                            }}
                          >
                            <SwiperFlatList
                                index={0}
                                autoplay
                                autoplayDelay={4}
                                autoplayLoop
                                data={iklan}
                                renderItem={renderItemIklan}
                                showPagination
                                paginationDefaultColor={'white'}
                                paginationActiveColor={color.dark_gold}
                                paginationStyleItem={{
                                  //backgroundColor:'white',
                                  height:10,
                                  width:10,
                                  borderRadius:10,
                                  marginLeft:-2,
                                }}
                                paginationStyle={{
                                  left:16
                                }}
                              />

                          </View>
                          
                          <Text
                            style={{
                              width: '100%',
                              textAlign: 'right',
                              color: 'black',
                              fontSize: 12,
                              marginTop: -30,
                            }}
                          >Lihat Semua Iklan</Text>

                          {/* Renungan, persembahan, merchandise */}
                          <View
                            style={{
                              flex:1,
                              flexDirection:'row',
                              justifyContent:'center',
                            }}
                          >
                            <TouchableOpacity>
                              <View
                                style={{
                                  flex:1,
                                  height:win.width/3 - size.padding_big - size.padding_default,
                                  width:win.width/3 - size.padding_big - size.padding_default,
                                  margin:10,
                                  backgroundColor:'white',
                                  justifyContent:'center',
                                  borderRadius:size.radius_default,
                                }}
                              >

                              <Image source={require('../../../img/renungan.png')} 
                              style={{
                                width:55,
                                height:45,
                                alignSelf:'center',
                                resizeMode:'contain',
                              }}/>

                              <Text
                                style={{
                                  width: '100%',
                                  textAlign: 'right',
                                  color: 'black',
                                  fontSize: 12,
                                  marginTop:size.padding_default,
                                  textAlign:'center',
                                }}
                              >Renungan</Text>

                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                              <View
                                style={{
                                  flex:1,
                                  height:win.width/3 - size.padding_big - size.padding_default,
                                  width:win.width/3- size.padding_big - size.padding_default,
                                  margin:10,
                                  backgroundColor:'white',
                                  justifyContent:'center',
                                  borderRadius:size.radius_default,
                                }}
                              >
                              <Image source={require('../../../img/persembahan.png')} 
                              style={{
                                width:55,
                                height:45,
                                alignSelf:'center',
                                resizeMode:'contain',
                              }}/>

                              <Text
                                style={{
                                  width: '100%',
                                  textAlign: 'right',
                                  color: 'black',
                                  fontSize: 12,
                                  marginTop:size.padding_default,
                                  textAlign:'center',
                                }}
                              >Persembahan</Text>
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                              <View
                                style={{
                                  flex:1,
                                  height:win.width/3 - size.padding_big - size.padding_default,
                                  width:win.width/3- size.padding_big - size.padding_default,
                                  margin:10,
                                  backgroundColor:'white',
                                  justifyContent:'center',
                                  borderRadius:size.radius_default,
                                }}
                              >
                              <Image source={require('../../../img/merchandise.png')} 
                              style={{
                                width:55,
                                height:45,
                                alignSelf:'center',
                                resizeMode:'contain',
                              }}/>

                              <Text
                                style={{
                                  width: '100%',
                                  textAlign: 'right',
                                  color: 'black',
                                  fontSize: 10,
                                  marginTop:size.padding_default,
                                  textAlign:'center',
                                }}
                              >Rock Merchandise</Text>

                              </View>
                            </TouchableOpacity>
                          </View>

                          {/* Line */}

                          <View style={{backgroundColor:'#E3E3E3',height:3}}></View>

                          {/* Bagian Video */}

                          <View
                            style={{
                              marginTop:size.default_padding,
                            }}
                          >

                            <Text
                              style={{
                                width: '100%',
                                color: 'black',
                                fontSize: 20,
                              }}
                            >Video Baru</Text>

                            <Text
                              style={{
                                width: '100%',
                                color: 'black',
                                fontSize: 12,
                              }}
                            >Jangan ngaku update kalau belum lihat video terbaru</Text>

                            <FlatList
                                data={video}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                onEndReached={loadMore}
                                style={{
                                  flexGrow:1
                                }}
                              />

                          </View>
                        </View>
                      </ScrollView>
                  </View>
              </View>
          </ImageBackground>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      
    },
    imageBackground: {
      flex: 1,
      resizeMode: "cover",
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
  

export default HomeScreen;
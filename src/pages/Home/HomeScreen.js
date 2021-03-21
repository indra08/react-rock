import React, { useState, useEffect } from 'react';
import { 
  Image,
  StyleSheet,
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";

import ListVideo from "../../component/ListVideo";
import Api from '../../api';
import SwiperFlatList from 'react-native-swiper-flatlist';

const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
var onProgress = false;
var offset = 0;

const HomeScreen = ({navigation}) => {
  
    const [video, setVideo] = useState([]);
    const [iklan, setIklan] = useState([]);
    const [length, setLength] = useState(5);
    const [isLast, setLast] = useState(false);

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

      onProgress = true;
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
            offset = (dataVideo.length != 0 ? (offset + dataVideo.length) : offset);
            await setLast(dataVideo.length != length ? true : false);
            
          }else{
            setLast(true);
          }

          onProgress = false;
        })
        .catch((error) => {
          console.log(error);
          onProgress = false;
        });
    };
    
    useEffect(() => {
        
        onProgress = false;
        offset = 0;
        getListVideo();
        getListIklan();
    }, []);

    const loadMore = async() => {
      
      console.log("tes");
      if(isLast === false && !onProgress){
          
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

        <SafeAreaView style={styles.safeArea}>

          <View style={styles.container}>
                  <View>
                      <ScrollView 
                        style={{
                          marginTop:size.default_padding
                        }}>

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
                            <TouchableOpacity
                              onPress={()=>{
                                navigation.navigate('Renungan');
                            }}
                            >
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

                            <TouchableOpacity
                              onPress={()=>{
                                navigation.navigate('Persembahan');
                              }}
                            >
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

                            <TouchableOpacity
                              onPress={()=>{
                                  navigation.navigate('Merchandise');
                              }}
                            >
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
                                  flexGrow:1,
                                  flex:1,
                                }}
                              />

                          </View>
                      </ScrollView>
                  </View>
              </View>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      flexDirection: "column",
      
    },
    container: {
      flex:1,
      flexDirection:"column",
      paddingLeft:size.padding_big,
      paddingRight:size.padding_big,
    }
  });
  

export default HomeScreen;
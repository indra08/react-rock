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
  TextInput,
} from "react-native";

// import custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const Event = ({navigation}) => {

  const [listEvent, setListEvent] = useState([]);
  var offset = 0;
  const [length, setLength] = useState(5);
  const [isLast, setLast] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
      
    getListEvent();
  }, []);

  const renderItem = ({item}) => {

    return (
      <View
        style={{
          flexDirection:'column',
        }}
      >

          <TouchableOpacity 
                      style={{
                          width:'100%',
                      }}
                      onPress={() => {
                          
                        navigation.navigate('DetailEvent',{id:item.id});
                      }}>

                          <View
                              style={{
                                  flexDirection:'column',
                                  paddingTop:size.default_padding,
                                  paddingBottom:size.default_padding,
                              }}
                          >

                              <View
                                style={{
                                  flexDirection:'row',
                              }}
                              >

                                <Image source={{uri:item.img_event}}
                                  style={{
                                    height:'100%',
                                    width:'35%',
                                    backgroundColor:'white',
                                    resizeMode:'cover'
                                  }}
                                />

                                <View
                                  style={{
                                    flex:1,
                                    backgroundColor : color.grey,
                                    flexDirection : 'column',
                                    paddingBottom : size.padding_big,
                                  }}
                                >

                                    <View
                                      style={{
                                        backgroundColor: getWarna(item.status_warna),
                                        width:'40%',
                                        alignSelf:'flex-end',
                                      }}
                                    >

                                      <Text
                                        style={{
                                          color:'white',
                                          textAlign:'center',
                                          padding: size.small_padding,
                                          
                                        }}
                                      >{item.status}</Text>
                                    </View>
                                        
                                    <View
                                      style={{
                                          marginLeft:size.default_padding,
                                          marginRight:size.default_padding,
                                          marginTop:size.padding_default
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize:19 ,
                                          width:'100%',
                                          textAlign:'center',
                                        }}
                                      >{item.nama_event}</Text>
                                    </View>
                                    
                                    <View
                                            style={{
                                            flexDirection:'row',
                                            marginLeft:size.default_padding,
                                            marginRight:size.default_padding,
                                            marginTop:size.default_padding,
                                            }}
                                        >
                                            <Text
                                            style={{flex : 0.3, }}
                                            >Tanggal</Text>
                                            <Text style={{flex : 0.7, fontSize:size.font_title2,}}>{": "+ item.tanggal}</Text>
                                    </View>

                                    <View
                                            style={{
                                            flexDirection:'row',
                                            marginLeft:size.default_padding,
                                            marginRight:size.default_padding,
                                            marginTop:size.small_padding,
                                            }}
                                        >
                                            <Text
                                            style={{flex : 0.3, }}
                                            >Jam</Text>
                                            <Text style={{flex : 0.7, fontSize:size.font_title2,}}>{": "+ item.jam}</Text>
                                    </View>

                                    <View
                                            style={{
                                            flexDirection:'row',
                                            marginLeft:size.default_padding,
                                            marginRight:size.default_padding,
                                            marginTop:size.small_padding,
                                            }}
                                        >
                                            <Text
                                            style={{flex : 0.3, }}
                                            >Tempat</Text>
                                            <Text style={{flex : 0.7, fontSize:size.font_title2,}}>{": "+ item.tempat}</Text>
                                    </View>
                                </View>
                              </View>

                          </View>
                </TouchableOpacity>

                <View style={{width:'100%', height:2, backgroundColor:color.dark_grey_soft}} ></View>
      </View>
      
      
    );
  };

  function getWarna(stateWarna){

    if(stateWarna == 0){
      return "#0DD12E"
    }else if(stateWarna == 1){
      return "#0055FF"
    }else if(stateWarna == 2){
      return "#BAB112"
    }else{
      return "#E60A0A"
    }
  }

  const getListEvent = async () => {

    const param = {
      start : offset,
      limit : length,
      flag  : search,
    };

    await Api.post('/jadwal/list_jadwal_event', param)
      .then( async (response) => {
        const metadata = response.data.metadata;
        const respon = response.data.response;

        var data = [];

        data.push(
          {
              id           : '1',
              nama_event   : 'TEST DALAM BERITA',
              img_event    : 'https://lh3.googleusercontent.com/proxy/SHOLUqMrGqDXy0YJZVo9aRtuVTeqXMM0PgNqv5aiuP2oBWG1SpzBgjuy8AC0nwMgPQj4NsjWC-rQ3rcL7Yk2kx8BNmocRR4HrX7zwbZbc-Mjx8p5kYtNVw8vsAk',
              tanggal      : '20 Januari 2021',
              jam          : '19:00',
              tempat       : 'Kamar atas',
              status       : 'tercengang',
              status_warna : '0',
            }
          );

          data.push(
            {
                id           : '2',
                nama_event   : 'DALAM BERITA TEST ',
                img_event    : 'https://lh3.googleusercontent.com/proxy/SHOLUqMrGqDXy0YJZVo9aRtuVTeqXMM0PgNqv5aiuP2oBWG1SpzBgjuy8AC0nwMgPQj4NsjWC-rQ3rcL7Yk2kx8BNmocRR4HrX7zwbZbc-Mjx8p5kYtNVw8vsAk',
                tanggal      : '20 Januari 2021',
                jam          : '19:00',
                tempat       : 'Kamar atas',
                status       : 'tercengang',
                status_warna : '1',
              }
            );

        if(metadata.status == 200){
  
          respon.map((item)=>{
        
            data.push(
              {
                id           : item.id,
                nama_event   : item.nama_event,
                img_event    : item.img_event,
                tanggal      : item.tanggal,
                jam          : item.jam,
                tempat       : item.tempat,
                status       : item.status,
                status_warna : item.status_warna,
              }
            );
          });

        }else{
            setLast(true);
        }

        await setListEvent(offset == 0 ? data : [...listEvent, ...data]);
        offset = data.length != 0 ? (offset + data.length) : offset;
        await setLast(data.length != length ? true : false);

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadMore = async() => {
    
    if(isLast === false){
        
        await getListEvent();
    }
  }

  return (

      <SafeAreaView style={styles.safeArea}>

        <View style={styles.container}>

            <View
                style={{
                    
                    flexDirection:'row',
                    backgroundColor:color.dark_grey_soft,
                    padding:10,
                    borderRadius:size.radius_default,
                    marginTop:size.padding_default
                }}
            >
                <Image
                    style={{
                        width:size.icon_size,
                        height:size.icon_size,
                    }}
                    source={require('../../../img/ic_search_gold.png')}
                ></Image>

                <TextInput
                    placeholder="Cari Event yang Sedang Berlangsung"
                    value={search}
                    style={{
                        marginLeft:size.padding_default,
                        width:'100%',
                    }}
                    onChangeText={(value) => setSearch(value)}
                    keyboardType="web-search"
                    onSubmitEditing={() =>{
                        
                    }}
                />
            </View>   

            <FlatList
                    data={listEvent}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onEndReached={loadMore}
                    style={{
                        flexGrow:1,
                        flex:1,
                    }}
                />

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
  

export default Event;
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

// import custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
var offset = 0;
var onProcess = false;

const Ibadah = ({navigation}) => {

    const [listIbadah, setListIbadah] = useState([]);
    const [length, setLength] = useState(5);
    const [isLast, setLast] = useState(false);
    
    useEffect(() => {
        
        offset = 0;
        onProcess = false;
        getListIbadah();
    }, []);

    const getListIbadah = async () => {

      onProcess = true; 
      const param = {
        start: offset,
        limit: length,
      };
  
      await Api.post('/jadwal/list_jadwal', param)
        .then( async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
  
          if(metadata.status == 200){
  
            var data = [];
            respon.map((item)=>{
    
              data.push(
                {
                  id            : item.id,
                  nama_ibadah   : item.nama_ibadah,
                  tanggal       : item.tanggal,
                  jam           : item.jam,
                  tempat        : item.tempat,
                  status        : item.status,
                  status_warna  : item.status_warna,
                  
                }
              );
            });
  
            await setListIbadah(offset == 0 ? data : [...listIbadah, ...data]);
            offset = (data.length != 0 ? (offset + data.length) : offset);
            await setLast(data.length != length ? true : false);
            
          }else{
              setLast(true);
          }

          onProcess = false;
        })
        .catch((error) => {
          console.log(error);
          onProcess = false;
        });
    };

  const loadMore = async() => {
    
      if(isLast === false && !onProcess){
          
          await getListNotif();
      }
    }
  
  const renderItem = ({item}) => {

      return (

        <TouchableOpacity 
              style={{
                  width:'100%',
                  backgroundColor:'white',
                  borderRadius:size.radius_default,
                  marginTop:size.default_padding,
                  marginBottom:size.default_padding,
              }}
              onPress={() => {
                 
                navigation.navigate('DetailIbadah',{id : item.id});
              }}>
                  <View
                      style={{
                          flexDirection:'column',
                      }}
                  >

                      <View
                        style={{
                          backgroundColor: getWarna(item.status_warna),
                          width:'40%',
                          alignSelf:'flex-end',
                          borderTopRightRadius:size.radius_default,
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
                          flexDirection:'row',
                          marginLeft:size.default_padding,
                          marginRight:size.default_padding,
                          marginTop:size.default_padding,
                        }}
                      >
                        <Text
                          style={{flex : 0.4, }}
                        >Nama Ibadah</Text>
                        <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ item.nama_ibadah}</Text>
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
                          style={{flex : 0.4, }}
                        >Tanggal</Text>
                        <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ item.tanggal}</Text>
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
                          style={{flex : 0.4, }}
                        >Jam</Text>
                        <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ item.jam}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection:'row',
                          marginLeft:size.default_padding,
                          marginRight:size.default_padding,
                          marginTop:size.default_padding,
                          marginBottom:size.med_padding,
                        }}
                      >
                        <Text
                          style={{flex : 0.4, }}
                        >Tempat</Text>
                        <Text style={{flex : 0.6, fontSize:size.font_title,}}>{": "+ item.tempat}</Text>
                      </View>

                  </View>
        </TouchableOpacity>
        
      );
    };

    function getWarna(stateWarna){

      if(stateWarna == 0){
        return "#3CC24F"
      }else if(stateWarna == 1){
        return "#0055FF"
      }else if(stateWarna == 2){
        return "#F20808"
      }else{
        return "#F2B408"
      }
    }

    return (

        <SafeAreaView style={styles.safeArea}>

          <View style={styles.container}>

              <FlatList
                    data={listIbadah}
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
  

export default Ibadah;
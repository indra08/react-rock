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
import DropDownPicker from 'react-native-dropdown-picker';

const Tiket = ({navigation}) => {
    
    const [listTiket, setListTiket] = useState([]);

    var selectedTiket = 'all';
    const [dinamicHeight, setDinamicHeight] = useState(0);
    
    var offset = 0;
    const [length, setLength] = useState(5);
    const [isLast, setLast] = useState(false);

    useEffect(() => {
      
      getListTiket();
    }, []);

    const renderItem = ({item}) => {

      return (

        <TouchableOpacity 
              style={{
                  width:'100%',
              }}
              onPress={() => {
                  
                if(item.flag == 'ibadah'){
                    navigation.navigate('DetailTiket',{

                      nobukti : item.nobukti,

                  });
                }
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

                        <Image source={item.flag == 'ibadah' ? require('../../../img/bg_tiketibadah.png'): require('../../../img/bg_tiketevent.png')}
                          style={{
                            height:'100%',
                            width:'25%',
                            resizeMode:'stretch'
                          }}
                        />

                        <View
                          style={{
                            flex:1,
                            backgroundColor:'white',
                            flexDirection:'column',
                            
                          }}
                        >

                            <View
                                    style={{
                                    flexDirection:'row',
                                    marginLeft:size.default_padding,
                                    marginRight:size.default_padding,
                                    marginTop:size.small_padding,
                                    }}
                                >
                                    <Text
                                    style={{flex : 0.4, }}
                                    >Nama</Text>
                                    <Text style={{flex : 0.6, fontSize:size.font_title2,}}>{": "+ item.nama}</Text>
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
                                    style={{flex : 0.4, }}
                                    >Nama Ibadah</Text>
                                    <Text style={{flex : 0.6, fontSize:size.font_title2,}}>{": "+ item.nama_jadwal}</Text>
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
                                    style={{flex : 0.4, }}
                                    >Tanggal</Text>
                                    <Text style={{flex : 0.6, fontSize:size.font_title2,}}>{": "+ item.tanggal}</Text>
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
                                    style={{flex : 0.4, }}
                                    >Jam</Text>
                                    <Text style={{flex : 0.6, fontSize:size.font_title2,}}>{": "+ item.jam}</Text>
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
                                    style={{flex : 0.4, }}
                                    >Kategori</Text>
                                    <Text style={{flex : 0.6, fontSize:size.font_title2,}}>{": "+ item.tempat}</Text>
                            </View>

                            <View
                                    style={{
                                    flexDirection:'row',
                                    marginLeft:size.default_padding,
                                    marginRight:size.default_padding,
                                    marginTop:size.small_padding,
                                    marginBottom:size.small_padding,
                                    }}
                                >
                                    <Text
                                    style={{flex : 0.4, }}
                                    >Kursi</Text>
                                    <Text style={{flex : 0.6, fontSize:size.font_title2,}}>{": "+ item.kursi}</Text>
                            </View>
                        </View>
                      </View>

                  </View>
        </TouchableOpacity>
        
      );
    };

    const getListTiket = async () => {

      const param = {
        start: offset,
        limit: length,
        flag: selectedTiket,
      };
  
      await Api.post('/ticket/list_ticket_v2', param)
        .then( async (response) => {
          const metadata = response.data.metadata;
          const respon = response.data.response;
  
          if(metadata.status == 200){
  
            var data = [];
            respon.map((item)=>{
            
              data.push(
                {
                  nobukti      : item.nobukti,
                  nama_jadwal  : item.nama_jadwal,
                  tanggal      : item.tanggal,
                  jam          : item.jam,
                  nama         : item.nama,
                  kursi        : item.kursi,
                  tempat       : item.tempat,
                  flag         : item.flag,
                }
              );
            });
  
            await setListTiket(offset == 0 ? data : [...listTiket, ...data]);
            offset = data.length != 0 ? (offset + data.length) : offset;
            await setLast(data.length != length ? true : false);
            
          }else{
              setLast(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const loadMore = async() => {
      
      if(isLast === false){
          
          await listTiket();
      }
    }

    return (

        <SafeAreaView style={styles.safeArea}>

          <View style={styles.container}>

              <DropDownPicker
                            items={[
                              {value : "all", label : "Semua Tiket", }
                              ,{value : "ibadah", label : "Tiket Ibadah"}
                              ,{value : "event", label : "Tiket Event"}
                            ]}
                            containerStyle={{height: 45}}
                            style={{
                                backgroundColor: 'white',
                            }}
                            defaultValue={ selectedTiket}
                            placeholder={"- Pilih -"}
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            dropDownStyle={{backgroundColor: 'white'}}
                            onChangeItem={item => {

                                selectedTiket = item.value;
                                setListTiket([]);
                                offset = 0;
                                setLast(false);
                                getListTiket();
                            }}
                            onOpen={() => {
                                
                                setDinamicHeight(45 * 2);
                            }}
                            onClose={() => {
                                setDinamicHeight(0);
                            }}
                        />

              <FlatList
                    data={listTiket}
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
      paddingTop:size.padding_default,
      paddingBottom:size.padding_default,
    }
  });
  

export default Tiket;
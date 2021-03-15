import React, {useEffect, useState} from 'react'
import { 
    View, 
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    ScrollView
 } from 'react-native';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');
import SwiperFlatList from 'react-native-swiper-flatlist';

const DetailEvent = ({route, navigation}) => {

    const [gambar, setGambar] = useState([]);
    const [namaEvent, setNamaEvent] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jam, setjam] = useState('');
    const [tempat, setTempat] = useState('');

    const { id } = route.params;

    useEffect(() => {
        
        getDetailEvent();
    }, []);

    const getDetailEvent = async () => {

        const param = {
          id : id,
        }; 
    
        await Api.post('/jadwal/detail_jadwal_event', param)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                setNamaEvent(respon.nama_event);
                setTanggal(respon.tanggal);
                setjam(respon.jam);
                setTempat(respon.tempat);

                var dataImage = [];
                dataImage.push(
                    {
                      img_url  :respon.img_event,
                    }
                  );
    
                setGambar(dataImage);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };

    const renderItemGambar = ({item}) => {
        return (
  
          <TouchableOpacity
              onPress={()=>{
  
              }}

              style={{
                width: win.width,
                height:(win.width *4/6),
              }}
            >
              <View style={{
                flex:1,
                padding:size.default_padding,
                flexDirection:'row',
                marginLeft:size.padding_default,
                marginRight:size.padding_default,
              }}>
                
                  <Image 
                    source={{uri: item.img_url}} 
                    style={{
                      flex:1,
                      resizeMode:'contain',
                      borderRadius: size.radius_default,
                    }}
                  />
                
              </View>
          </TouchableOpacity>
        );
      };

    return (
        <SafeAreaView style={styles.saveArea}>

            <View
                style={{
                    flex:1,
                    flexDirection:'column',
                }}
            >

                <View
                    style={{
                        backgroundColor:color.dark_grey_soft,
                    }}
                >
                    <SwiperFlatList
                        index={0}
                        autoplay
                        autoplayDelay={4}
                        autoplayLoop
                        data={gambar}
                        renderItem={renderItemGambar}
                        showPagination
                        paginationDefaultColor={'white'}
                        paginationActiveColor={color.dark_gold}
                        paginationStyleItem={{
                            height:10,
                            width:10,
                            borderRadius:10,
                        }}
                        style={{
                            
                        }}
                    />
                </View>

                <ScrollView
                    style={{margin:size.padding_big}}
                >

                    <Text
                        style={{
                            color:'black',
                            fontSize:24,
                            fontWeight:'bold',
                        }}
                    >{namaEvent}</Text>

                    <View
                        style={{
                            flexDirection:'row',
                        }}
                    >

                        <Text
                            style={{
                                flex:0.3
                            }}
                        >Tanggal</Text>
                        <Text style={{flex : 0.7, fontSize:size.font_title2,}}>{": "+ tanggal}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection:'row',
                        }}
                    >

                        <Text
                            style={{
                                flex:0.3
                            }}
                        >Jam</Text>
                        <Text style={{flex : 0.7, fontSize:size.font_title2,}}>{": "+ jam}</Text>
                            
                    </View>

                    <View
                        style={{
                            flexDirection:'row',
                        }}
                    >

                        <Text
                            style={{
                                flex:0.3
                            }}
                        >Tempat</Text>
                        <Text style={{flex : 0.7, fontSize:size.font_title2,}}>{": "+ tempat}</Text>
                            
                    </View>
                </ScrollView>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    saveArea:{
        flex: 1,
        backgroundColor: color.grey,
    },
});

export default DetailEvent;

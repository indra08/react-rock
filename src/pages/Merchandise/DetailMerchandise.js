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

const DetailMerchandise = ({route, navigation}) => {

    const [gambar, setGambar] = useState([]);
    const [namaBarang, setNamaBarang] = useState('');
    const [harga, setHarga] = useState('');
    const [deskripsi, setDeskripsi] = useState('');

    const { id } = route.params;

    useEffect(() => {
        
        getListImage();
    }, []);

    const getListImage = async () => {

        const param = {
          id : id,
        }; 
    
        await Api.post('/merchandise/detail_product', param)
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){
    
                var images = respon.images;
                setNamaBarang(respon.namabrg);
                setHarga(respon.harga);
                setDeskripsi(respon.deskripsi);

                var dataImage = [];
                images.map((item)=>{
                
                  dataImage.push(
                    {
                      img_url  :item.img_url,
                    }
                  );
    
                });
    
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
                    >{namaBarang}</Text>

                    <Text
                        style={{
                            color:'#C9A95F',
                            fontSize:22,
                            marginTop:size.padding_big,
                        }}
                    >{harga}</Text>

                    <View
                        style={{
                            width:'100%',
                            height:size.default_border,
                            backgroundColor:color.dark_grey_soft,
                            marginTop:size.padding_big,
                        }}
                    ></View>

                    <Text
                        style={{
                            color:'black',
                            fontSize:14,
                            marginTop:size.padding_big,
                        }}
                    >{deskripsi}</Text>
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

export default DetailMerchandise;

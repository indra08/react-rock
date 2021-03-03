import React, {useEffect, useState} from 'react'
import { 
    View, 
    Text, 
    SafeAreaView,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TextInput,
    TouchableOpacity,
    Platform,
    FlatList,
} from 'react-native';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const Merchandise = ({navigation}) => {

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);
    const [isAll, setIsAll] = useState(false);
    const [isTermurah, setTermurah] = useState(false);
    const [isTermahal, setTermahal] = useState(false);
    const [merchandise, setMerchandise] = useState([]);
    const [length, setLength] = useState(5);
    const [isLast, setLast] = useState(false);

    var selectedFilter = '';
    var offset = 0;

    useEffect(() => {
        
        getListMerchandise();
    }, []);

    const getListMerchandise = async () => {
        
        const param = {
          start: offset,
          limit: length,
          keyword: search,
          sort_by: selectedFilter,
        };
  
        await Api.post('/merchandise/filter_product', param)
          .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
  
            if(metadata.status == 200){
  
              var dataMerchant = [];
              respon.map((item)=>{
                dataMerchant.push(
                  {
                    id       :item.id,
                    namabrg  :item.namabrg,
                    harga    :item.harga,
                    img_url  :item.img_url
                  }
                );
              });
  
              await setMerchandise(offset == 0 ? dataMerchant : [...merchandise, ...dataMerchant]);
              offset = dataMerchant.length != 0 ? (offset + dataMerchant.length) : offset;
              //console.warn('listFilm', offset);
              await setLast(dataMerchant.length != length ? true : false);
              
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
            await getListMerchandise();
        }
    }

    function setFilterState(){
        
        if(selectedFilter == 'all'){
            setIsAll(true);
            setTermurah(false);
            setTermahal(false);
        }else if(selectedFilter == 'termurah'){
            
            setIsAll(false);
            setTermurah(true);
            setTermahal(false);
        }else if(selectedFilter == 'termahal'){

            setIsAll(false);
            setTermurah(false);
            setTermahal(true);
        }else{
            setIsAll(false);
            setTermurah(false);
            setTermahal(false);
        }

        console.log(selectedFilter);

        offset = 0;
        setMerchandise([]);
        getListMerchandise();
    }

    const renderItem = ({item}) => {

        return (

          <TouchableOpacity 
                style={{
                    width:'50%',
                    backgroundColor:'white',
                    padding:size.small_padding,
                }}
                
                onPress={() => {

                    navigation.navigate('DetailMerchandise', {id:item.id});
                }}>
                    <View
                        style={{
                            flexDirection:'column',
                        }}
                    >
                        <Image source={{uri: item.img_url}} style={
                            {
                                height: (win.width *2/4),
                                resizeMode:'contain',
                                
                            }
                        }/>

                        <View
                            style={{
                                backgroundColor:'black',
                                padding:size.default_padding,
                            }}
                        >

                            <Text style={{
                                color:'white'
                            }}
                            >{item.namabrg}</Text>

                            <Text style={{
                                color:'yellow',
                                marginTop:size.small_padding,
                            }}
                            >{item.harga}</Text>
                        </View>
                    </View>
          </TouchableOpacity>
          
        );
      };

    return (
        <SafeAreaView style={styles.saveArea}>
            <View
                style={{
                    flex:1,
                    margin:22,
                }}
            >
                <View
                    style={{
                        flexDirection:'row-reverse'
                    }}
                >

                    <TouchableOpacity
                        style={{
                            paddingTop:4,
                            marginLeft:size.padding_default,
                        }}
                        onPress={()=>{
                            
                            setFilter(!filter);
                        }}
                    >
                        <Image
                            style={{
                                width:34,
                                height:34,
                            }}

                            source={require('../../../img/filter.png')}
                        ></Image>
                    </TouchableOpacity>

                    <View
                        style={{
                            flex:1,
                            flexDirection:'row',
                            backgroundColor:color.dark_grey_soft,
                            padding:10,
                            borderRadius:size.radius_default,
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
                            placeholder="Cari merchandise kesukaanmu"
                            value={search}
                            style={{
                                marginLeft:size.padding_default,
                            }}
                            onChangeText={(value) => setSearch(value)}
                            keyboardType="web-search"
                            onSubmitEditing={() =>{
                                
                            }}
                        />
                    </View>
                </View>

                <FlatList
                    data={merchandise}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onEndReached={loadMore}
                    style={{
                        flexGrow:1,
                        marginTop: size.default_padding,
                    }}
                    numColumns={2}
                />

                {/* Modal setting */}
                <Modal animationType="fade" transparent={true} visible={filter}>

                    <TouchableOpacity
                        style={{
                            width:'100%',
                            height:'100%',
                        }}
                        onPress={()=>{

                            setFilter(false);
                        }}
                    >

                        <View
                            style={{
                                flexDirection:'row',
                                alignSelf:'center',
                                justifyContent:'center',
                                width:'100%',
                                height:'100%',
                            }}>

                        <TouchableOpacity 
                                style={{
                                    flex: 0.3,
                                    height:50,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    borderColor:color.dark_grey_soft,
                                    borderRadius:6,
                                    marginLeft:1,
                                    marginRight:1,
                                    borderWidth:2,
                                    backgroundColor: isAll ? color.dark_grey_soft: 'white',
                                    marginTop:Platform.OS === 'android' ? 120 : 170,
                                }}
                                backgroundColor={isAll? color.dark_grey_soft : 'white'}
                                onPress={()=>{
                                    selectedFilter = 'all';
                                    setFilterState();
                                }}
                        >

                                <Text style={styles.textLabel} >
                                    All
                                </Text>
                            
                        </TouchableOpacity>

                        <TouchableOpacity 
                                style={{
                                    flex: 0.3,
                                    height:50,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    borderColor:color.dark_grey_soft,
                                    borderRadius:6,
                                    marginLeft:1,
                                    marginRight:1,
                                    borderWidth:2,
                                    backgroundColor: isTermurah ? color.dark_grey_soft: 'white',
                                    marginTop:Platform.OS === 'android' ? 120 : 170,
                                }}
                                onPress={()=>{
                                    selectedFilter = 'termurah';
                                    setFilterState();
                                }}
                            >

                                <Text style={styles.textLabel} >
                                    Termurah
                                </Text>
                            
                        </TouchableOpacity>

                        <TouchableOpacity  
                                style={{
                                    flex: 0.3,
                                    height:50,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    borderColor:color.dark_grey_soft,
                                    borderRadius:6,
                                    marginLeft:1,
                                    marginRight:1,
                                    borderWidth:2,
                                    backgroundColor: isTermahal ? color.dark_grey_soft: 'white',
                                    marginTop:Platform.OS === 'android' ? 120 : 170,
                                }}
                                onPress={()=>{
                                    selectedFilter = 'termahal';
                                    setFilterState();
                                }}
                            >

                                <Text style={styles.textLabel} >
                                    Termahal
                                </Text>
                            
                        </TouchableOpacity>
                        
                        </View>
                    </TouchableOpacity>
                    
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    saveArea:{
        flex: 1,
        backgroundColor: color.grey,
    },
    scrollView:{
        margin:20,
    },
    textLabel:{
        color:'black',
        fontSize:16,
    },
    textValue:{
        flex: 0.7,
        color:'black',
        fontSize:16,
        marginTop: size.small_padding,
    },
});

export default Merchandise;

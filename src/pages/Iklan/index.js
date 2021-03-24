import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    FlatList,
    TouchableOpacity,
    BackHandler,
    Image,
} from 'react-native';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

var offset = 0;
var onProcess = false;

const Iklan = ({navigation}) => {

    const [listNotif, setListNotif] = useState([]);
    const [length, setLength] = useState(10);
    const [isLast, setLast] = useState(false);

    useEffect(() => {

        offset = 0;
        onProcess = false;
        
        getListIklan();

        // Handling Back press
        const backAction = () => {
            navigation.replace('Home');
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
    }, []);

    const getListIklan = async () => {

        onProcess = true;
        const param = {
          start: offset,
          limit: length,
        };
    
        await Api.post('/iklan/list_iklan', param)
          .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
    
              var dateNotif = [];
              respon.map((item)=>{
              
                dateNotif.push(
                  {
                    id      : item.id,
                    title   : item.title,
                    text    : item.text,
                    img_url : item.img_url,
                  }
                );
              });
    
              await setListNotif(offset == 0 ? dateNotif : [...listNotif, ...dateNotif]);
              offset = (dateNotif.length != 0 ? (offset + dateNotif.length) : offset);
              await setLast(dateNotif.length != length ? true : false);
              
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
            
            await getListIklan();
        }
      }
    
    const renderItem = ({item}) => {

        return (

          <TouchableOpacity 
                style={{
                    width:'100%',
                }}
                onPress={() => {
                    navigation.navigate('DetailIklan', {id:item.id});
                }}>
                    <View
                        style={{
                            flexDirection:'column',
                            padding:size.default_padding,
                        }}
                    >

                        <Image
                            source={{uri: item.img_url}}
                            style={{
                                width:'100%',
                                height:160,
                                resizeMode:'cover'
                            }}
                        >
                        </Image>

                        <Text
                            style={{
                                marginTop:size.padding_default,
                                marginBottom:size.padding_default,
                            }}
                        >
                            {item.title}
                        </Text>

                        <View style={{backgroundColor:color.grey, width:'100%', height:size.padding_default}}></View>

                    </View>
          </TouchableOpacity>
          
        );
      };

    return (
        <SafeAreaView style={styles.saveArea}>

            <View
                style={styles.container}
            >
                <FlatList
                    data={listNotif}
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
}

const styles = StyleSheet.create({
    saveArea:{
        flex: 1,
        flexDirection: "column",
        backgroundColor:'white',
    },
    container:{
        flex:1,
    },
});

export default Iklan;

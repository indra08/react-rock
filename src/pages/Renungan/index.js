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
} from 'react-native';

//Import Custom
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

var offset = 0;
var onProcess = false;

const Renungan = ({navigation}) => {

    const [listNotif, setListNotif] = useState([]);
    const [length, setLength] = useState(10);
    const [isLast, setLast] = useState(false);

    useEffect(() => {

        offset = 0;
        onProcess = false;
        
        getListRenungan();

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

    const getListRenungan = async () => {

        onProcess = true;
        const param = {
          start: offset,
          limit: length,
        };
    
        await Api.post('/renungan/list_renungan', param)
          .then( async (response) => {
            const metadata = response.data.metadata;
            const respon = response.data.response;
    
            if(metadata.status == 200){
    
              var data = [];
              respon.map((item)=>{
              
                data.push(
                  {
                    id          : item.id,
                    title       : item.title,
                    tanggal     : item.tanggal,
                    text        : item.text,
                  }
                );
              });
    
              await setListNotif(offset == 0 ? data : [...listNotif, ...data]);
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
            
            await getListRenungan();
        }
      }
    
    const renderItem = ({item}) => {

        return (

          <TouchableOpacity 
                style={{
                    width:'100%',
                }}
                onPress={() => {
                    navigation.navigate('DetailRenungan', {id:item.id});
                }}>
                    <View
                        style={{
                            flexDirection:'column',
                            paddingTop:size.default_padding,
                            paddingBottom:size.padding_big,
                            paddingLeft:size.padding_big,
                            paddingRight:size.padding_big,
                            backgroundColor:'white',
                            margin: size.padding_default,
                            borderRadius: size.radius_default,
                        }}
                    >

                        <View
                            style={{
                                flexDirection:'row-reverse',
                            }}
                        >  

                            <Text
                                style={{
                                    flex:0.7,
                                    color:'#B7AFAF',
                                    fontSize:13,
                                    textAlign:'right',
                                }}
                            >
                                {item.tanggal}
                            </Text>
                        </View>

                        <Text
                            style={{
                                flex:1,
                                color:'black',
                                fontSize:17,
                                marginTop: size.small_padding,
                            }}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>

                        <Text
                            style={{
                                color:'black',
                                marginTop:size.default_padding,
                                fontSize:12,
                            }}
                            numberOfLines={2}
                        >
                            {item.text}
                        </Text>

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
                        margin:size.padding_default,
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
        backgroundColor:'#F3F3F3',
    },
});

export default Renungan;

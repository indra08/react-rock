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

const Notif = ({navigation}) => {

    const [listNotif, setListNotif] = useState([]);
    const [offset, setOffset] = useState(0);
    const [length, setLength] = useState(5);
    const [isLast, setLast] = useState(false);

    useEffect(() => {
        
        getListNotif();

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

    const getListNotif = async () => {

        const param = {
          start: offset,
          limit: length,
        };
    
        await Api.post('/notification/list_notif', param)
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
                    notif   : item.notif,
                    date    : item.date,
                    hour    : item.hour,
                  }
                );
              });
    
              await setListNotif(offset == 0 ? dateNotif : [...listNotif, ...dateNotif]);
              await setOffset(dateNotif.length != 0 ? (offset + dateNotif.length) : offset);
              await setLast(dateNotif.length != length ? true : false);
              
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
            
            await getListNotif();
        }
      }
    
    const renderItem = ({item}) => {

        return (

          <TouchableOpacity 
                style={{
                    width:'100%',
                }}
                onPress={() => {
                    navigation.navigate('DetailNotif', {id:item.id});
                }}>
                    <View
                        style={{
                            flexDirection:'column',
                            padding:size.default_padding,
                        }}
                    >

                        <View
                            style={{
                                flexDirection:'row',
                            }}
                        >

                                <Text
                                    style={{
                                        flex:0.6,
                                        color:'black',
                                        fontSize:18,
                                    }}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={{
                                        flex:0.4,
                                        color:'black',
                                        fontSize:13,
                                        textAlign:'right',
                                    }}
                                >
                                    {item.date +" "+ item.hour}
                                </Text>
                        </View>

                        <Text
                            style={{
                                color:'black',
                                marginTop:size.default_padding,
                            }}
                            numberOfLines={2}
                        >
                            {item.notif}
                        </Text>

                        <View style={{
                            backgroundColor: color.dark_grey,
                            marginTop:size.default_padding,
                            height:1,
                        }}></View>

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
    },
    container:{
        flex:1,
    },
});

export default Notif;

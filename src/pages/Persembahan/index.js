import React,{useEffect, useState} from 'react';
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    BackHandler
} from 'react-native';

// Ambil sebagai importan defautl
import Api from '../../api';
const size = require('../../Res/size');
const color = require('../../Res/color');
const win = Dimensions.get('window');

const Persembahan = () => {

    const [title, setTittle] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [bank, setBank] = useState('');
    const [atasNama, setAtasNama] = useState('');
    const [rekening, setRekening] = useState('');
    const [image, setImage] = useState('');
    
    useEffect(() => {
        
        getDataPersembahan();

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

    const getDataPersembahan = async () => {

        const param = {
          
        }; 
    
        await Api.get('/Persembahan/get_persembahan')
          .then( async (response) => {
              const metadata = response.data.metadata;
              const respon = response.data.response;
    
              if(metadata.status == 200){

                setTittle(respon.judul);
                setKeterangan(respon.keterangan);
                setBank(respon.bank);
                setAtasNama(respon.an);
                setRekening(respon.no_rek);
                setImage(respon.qr_url);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      };

    return (
        <SafeAreaView style={styles.saveArea}>
            <ScrollView
                style={styles.scrollView}
            >
                
                <Text
                    style={{
                        color:'black',
                        fontSize:22,
                        marginTop:size.medium_padding,
                    }}
                >
                    {title}
                </Text>

                <Text
                    style={{
                        color:'black',
                        fontSize:13,
                        marginTop: size.default_padding,
                    }}
                >
                    {keterangan}
                </Text>

                <View style={{ flexDirection:'row', marginTop:size.padding_default}} >
                    <Text style={styles.textLabel}>
                        Bank
                    </Text>

                    <Text style={styles.textValue}>
                        {bank}
                    </Text>

                </View>

                <View style={{ flexDirection:'row'}} >
                    <Text style={styles.textLabel} >
                        Atas Nama
                    </Text>

                    <Text style={styles.textValue}>
                        {atasNama}
                    </Text>

                </View>

                <View style={{ flexDirection:'row'}} >
                    <Text style={styles.textLabel} >
                        Rekening
                    </Text>

                    <Text style={styles.textValue}>
                        {rekening}
                    </Text>

                </View>

                <Image
                    style={{
                        width: '100%',
                        height: win.height *4/6,
                        marginTop:40,
                        resizeMode:'contain',
                        alignSelf:'center',
                    }}
                    source={{uri: image}}
                ></Image>
            </ScrollView>
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
        flex: 0.3,
        color:'black',
        fontSize:16,
        marginTop: size.small_padding,
    },
    textValue:{
        flex: 0.7,
        color:'black',
        fontSize:16,
        marginTop: size.small_padding,
    },
});

export default Persembahan;

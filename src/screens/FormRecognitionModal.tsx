import * as React from 'react';
import {
    Screen, Colors, Icon, LanguageContext, ThemeContext, Title, Text, Modal
} from '@infominds/react-native-components';
import { AppRegistry, ImageStore, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { RNCamera } from 'react-native-camera';
import Camera from '../components/Camera'
import Permissions from '../components/Permissions';
import FillToAspectRatio from '../components/FillToAspectRatio';
import { useState } from 'react';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
import useApi from '../apis/useApi';
import LoadingSpinnerModal from '../components/LoadingSpinnerModal';


export default function FormRecognitionModal(props: { isVisible: boolean, onClose: any, onResult: any }) {
    let [result, setResult] = useState<any>('')
    let [permission, setPermission] = useState('undetermined')
    let cameraRef = React.useRef(null)

    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [loading, setLoading] = useState<boolean>(false)

    const [resizeImageOptions, setResizeImageOptions] = useState<{ maxWidth: number, maxHeight: number, quality: number }>({ maxWidth: 1080, maxHeight: 1920, quality: 60 });

    React.useEffect(() => {
        // @ts-ignore
        Permissions.check('photo').then(response => {
            setPermission(response);
        });
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            setLoading(true);

            const options = { quality: 0.5, base64: true };
            // @ts-ignore
            const data = await cameraRef.current?.takePictureAsync(options);
            // @ts-ignore
            cameraRef?.current?.pausePreview();
            var resizedImage = await ImageResizer.createResizedImage(data.uri, resizeImageOptions.maxWidth, resizeImageOptions.maxHeight, 'JPEG', resizeImageOptions.quality, 0);

            var base64String = await ImgToBase64.getBase64String(resizedImage.uri);
            base64String = base64String.replaceAll('\n', '')

            useApi.formRecognition({ image: base64String })
                .then((res => {
                    console.log(res);
                    res.invoiceTotal = res.invoiceTotal / 100;
                    res.invoiceDate = new Date(res.invoiceDate);
                    setResult(res);
                    props.onResult({ formRecognition: res, image: { image: base64String } })

                }))
                .catch((err) => { console.error(err); setLoading(false); props.onClose(); })
                .finally(() => { setLoading(false); props.onClose(); });
        }
    };
    return (
        <Modal
            visible={props.isVisible}
            close={props.onClose}
            swipeDirection={[]}
            backdropOpacity={0.8}
            style={{
                height: '85%',
                width: '100%',
                backgroundColor: Colors.grey,
                padding: 0
            }}
            content={
                <View
                    style={{
                        flex: 1,
                    }}>
                    <View style={{ flex: 0, backgroundColor: Colors.grey, borderRadius: 5, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', backgroundColor: Colors.white, borderRadius: 15, margin: 10 }}
                            onPress={() => {
                                props.onClose();
                            }}>
                            <Icon name='x' color={Colors.black} size={25} />
                        </TouchableOpacity>
                    </View >
                    {Platform.OS === 'web' ? <></> :
                        <FillToAspectRatio>
                            <Camera
                                ref={cameraRef}
                                style={styles.preview}
                                captureAudio={false}
                                type={'back'}
                                flashMode={'off'}
                            />
                        </FillToAspectRatio>
                    }

                    <TouchableOpacity onPress={takePicture} style={styles.capture}>
                        <Icon size={35} color={Colors.white} name='camera'></Icon>
                    </TouchableOpacity>

                    <LoadingSpinnerModal visible={loading} />
                </ View>
            }>
        </Modal >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        width: '100%',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        width: '100%',
        alignItems: 'center',
        backgroundColor: Colors.grey,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',

    },
});
import React, { useState } from 'react';
import { PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import { Icon, View, Colors } from '@infominds/react-native-components';
import { CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MediaPlayer from './MediaPlayer';

export default function ImagePicker(props: {
    options?: ImageLibraryOptions,
    cameraOptions?: CameraOptions,
    preview?: boolean,
    onSelect?: (response: ImagePickerResponse) => void,
    videoEnabled?: boolean
}) {
    const options = props.options ?? { mediaType: 'mixed', selectionLimit: 10 };

    const [source, setSource] = useState<any>();

    function onSelect(response: ImagePickerResponse) {
        if (!response.didCancel) {
            // @ts-ignore
            console.log(response.assets[0]);
            // @ts-ignore
            setSource(response.assets[0]);
            props.onSelect?.(response);
        }
    }

    async function openCamera(customOptions?: ImageLibraryOptions) {
        let granted;
        if (Platform.OS === 'android') {
            const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: "App Camera Permission",
                message: "App needs access to your camera to upload to ERP",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            });
            granted = (res === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            granted = true;
        }

        if (granted) {
            launchCamera({ ...props.cameraOptions, ...options, ...customOptions }, onSelect)
        }
    }

    const IconButton = (ibProps: { onPress: () => void, name: string, color?: string }) => (
        <TouchableOpacity style={{ margin: 3, padding: 12, borderRadius: 10, backgroundColor: ibProps.color ?? Colors.grey }} onPress={ibProps.onPress} >
            <Icon name={ibProps.name} size={25} color={Colors.white} />
        </TouchableOpacity>
    );

    return (<>
        {(props.preview ?? true) &&
            <MediaPlayer source={source} onClose={() => setSource(undefined)} />
        }

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <IconButton onPress={() => openCamera({ mediaType: 'photo' })} name='camera' />
            {props.videoEnabled ?
                <IconButton onPress={() => openCamera({ mediaType: 'video' })} name='video' /> : <></>
            }
            <IconButton onPress={() => launchImageLibrary(options, onSelect)} name='image' />
            {(props.preview ?? true) && source &&
                <IconButton onPress={() => setSource(undefined)} name='x' color={Colors.red} />
            }
        </View>
    </>);
}
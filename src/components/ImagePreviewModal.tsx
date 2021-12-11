import React, { useState } from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import { View, Colors, ThemeContext, Modal, Icon } from '@infominds/react-native-components';
import { backdropOpacity } from "../styles/ModalStyles";
import ImageZoom from 'react-native-image-pan-zoom';


export default function ImagePreviewModal(props: { isVisible: boolean, close: () => void, src: string }) {
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [width, setWidth] = useState<number>(Dimensions.get('window').width);
    const [height, setHeight] = useState<number>(Dimensions.get('window').height);

    return (
        <Modal
            isVisible={props.isVisible}
            close={props.close}
            backdropOpacity={backdropOpacity}
            keyboardAvoiding
            propagateSwipe
            swipeDirection={[]}
            style={{

                // height: 'auto',
                height: '70%',
                width: '96%',
                marginLeft: '2%',
                backgroundColor: theme.backgroundModal,
                padding: 0
            }}
            content={
                <View style={{
                    flex: 1
                }}>
                    <TouchableOpacity
                        style={{ alignSelf: 'flex-end', backgroundColor: '#fff', borderRadius: 15, margin: 10 }}
                        onPress={() => {
                            props?.close()
                        }}>
                        <Icon name='x' color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center'

                    }}
                        onLayout={(event) => {
                            setWidth(event.nativeEvent.layout.width);
                            setHeight(event.nativeEvent.layout.height)
                        }}>
                        <ImageZoom
                            style={{}}
                            cropWidth={width}
                            cropHeight={height}
                            imageWidth={width}
                            imageHeight={width}
                        >
                            <Image
                                resizeMode='contain'
                                style={{ width: '100%', height: '100%' }}
                                source={{ uri: props.src }} />
                        </ImageZoom>
                    </View>
                </ View>
            }
        />
    )
}
import { View, Icon, Modal, Colors, ThemeContext } from '@infominds/react-native-components';
import React, { useState, useEffect } from 'react';
import { Dimensions, Image, TouchableOpacity } from 'react-native';
// import Video from 'react-native-video';

export default function MediaPlayer(props: { source: any, onClose: any }) {
    const [isVisible, setVisible] = useState(false);

    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [width, setWidth] = useState<number>(Dimensions.get('window').width);

    useEffect(() => {
        if (props.source) setVisible(true);
    }, [props.source]);

    function choosePlayer() {
        if (!props.source) return <View />

        if (props?.source?.type && props?.source?.type !== 'audio') return ( // Photo
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ height: 400, width: width }}
                    resizeMode='contain'
                    source={props.source}
                />
            </View>
        );

        // return ( // Video
        //     <Video
        //         style={{ height: 400, zIndex: 100 }}
        //         resizeMode='contain'
        //         source={props.source}
        //         controls={true}
        //     />
        // );
    }

    return (

        <Modal
            isVisible={isVisible}
            close={() => setVisible(false)}
            keyboardAvoiding
            propagateSwipe
            swipeDirection={[]}
            style={{
                height: '70%',
                width: '100%',
                backgroundColor: theme.backgroundModal,
                padding: 0
            }}
            content={
                <View style={{
                    flex: 1,
                    width: '100%'
                }}>
                    <TouchableOpacity
                        style={{ alignSelf: 'flex-end', backgroundColor: '#fff', borderRadius: 15, margin: 10 }}
                        onPress={() => {
                            setVisible(false)
                        }}>
                        <Icon name='x' color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '100%'
                    }}
                        onLayout={(event) => {
                            setWidth(event.nativeEvent.layout.width);
                        }}>
                        {choosePlayer()}
                    </View>
                </ View>
            }
        />
    );
}
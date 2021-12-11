import { View, Icon, ModalBottom } from '@infominds/react-native-components';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function MediaPlayer(props: { source: any, onClose: any }) {
    const [isVisible, setVisible] = useState(false);

    React.useEffect(() => {
        if (props.source) setVisible(true);
    }, [props.source]);

    function choosePlayer() {
        if (!props.source) return <View />

        if (props?.source?.type && props?.source?.type !== 'audio') return ( // Photo
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ height: 400 }}
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
        <ModalBottom
            isVisible={isVisible}
            close={() => setVisible(false)}
            swipeDirection={[]}
            content={<>
                <TouchableOpacity onPress={() => { setVisible(false); props.onClose(); }}>
                    <Icon name='x' size={28} style={{ alignSelf: 'flex-end' }}></Icon>
                </TouchableOpacity>

                <View>{choosePlayer()}</View>
            </>}
        />
    )

}
import React from "react";
import { ModalBottom, View } from '@infominds/react-native-components';
import ModalCloseButton from "./ModalCloseButton";


export default function ContentPopupModal(props: { isVisible: boolean, close: any, content: any, style?: any }) {
    return (
        <ModalBottom
            isVisible={props.isVisible}
            close={props.close}
            backdropOpacity={0.4}
            style={[{
                padding: 0,
                boarderRadisTop: 8,
                // backgroundColor: Colors.grey
                width: '96%',
                marginLeft: '2%'
            }, props.style]}
            propagateSwipe
            KeyboardAvoiding={false}
            swipeDirection={[]}
            content={
                <View style={{}}>
                    <View style={{ padding: 20, paddingBottom: 0 }}>
                        <ModalCloseButton onPress={props.close} />
                    </View>

                    {/* <View style={{
                        flex: 1,
                        height: '100%',
                        padding: 0,
                        marginTop: 0,
                        paddingBottom: 0,
                        marginBottom: 0
                        // backgroundColor: theme.background
                    }}> */}
                    {props.content()}
                    {/* </View> */}
                </View>
            }
        />
    )
}

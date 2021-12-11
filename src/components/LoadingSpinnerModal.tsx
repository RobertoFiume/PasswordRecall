import * as React from 'react'
import { Colors, LoadingIndicator } from "@infominds/react-native-components";
import { View } from 'react-native';
import DefaultModal from 'react-native-modal';

export default function LoadingSpinnerModal(props: { visible: boolean }) {
    return (
        <DefaultModal isVisible={props.visible} >
            <View >
                <LoadingIndicator color={Colors.tint} isVisible={true}></LoadingIndicator>
            </View>
        </DefaultModal>
    )

}

import React, { useContext } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Icon, ModalBottom, Title, View, LanguageContext, Colors, ThemeContext } from '@infominds/react-native-components';
import Settings from "../screens/SettingsScreen"
import { backdropOpacity } from "../styles/ModalStyles";

export default function SettingsModal(props: { navigation: any, onSettingsChange: () => void, isVisible: boolean, close: () => void }) {
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];
    const lang = useContext(LanguageContext);

    return (
        <ModalBottom
            isVisible={props.isVisible}
            close={props.close}
            backdropOpacity={backdropOpacity}
            keyboardAvoiding
            propagateSwipe
            swipeDirection={[]}
            style={{
                height: 'auto',
                maxHeight: '90%',
                width: '96%',
                marginLeft: '2%',
                backgroundColor: Colors.grey,
                padding: 0
            }}
            content={
                <View style={{ height: 'auto' }}>
                    <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.grey }}>
                        <Title style={{ color: '#fff' }}>{lang.SETTINGS}</Title>
                        <TouchableOpacity onPress={props.close}>
                            <Icon name='x' size={25} color={Colors.white} style={{ alignSelf: 'flex-end' }}></Icon>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={{ height: 'auto', backgroundColor: theme.background }}>
                            <Settings isSettingsOpen={props.isVisible} onSettingsChange={props.onSettingsChange} navigation={props.navigation}></Settings>
                        </View>
                    </ScrollView>
                </View>
            }
        />
    )
}
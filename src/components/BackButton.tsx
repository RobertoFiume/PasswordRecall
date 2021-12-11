import * as React from 'react'
import { Colors, Icon, LanguageContext, Text, ThemeContext } from "@infominds/react-native-components";
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';

export default function BackButton(props: { onPress: any, textVisible?: boolean }) {
    const lang = React.useContext(LanguageContext);

    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity
            onPress={props.onPress}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                width: '30%',
                padding: 5,
                marginBottom: 10,
            }}>

                <Icon
                    name={'arrow-left'}
                    size={28}
                    color={theme.text}></Icon>
                {props.textVisible ?
                    <Text
                        style={{ fontSize: 20, marginLeft: 10 }}
                        onPress={props.onPress}>
                        {lang.BACK}
                    </Text> : <></>}

            </View>
        </TouchableOpacity>
    )

}

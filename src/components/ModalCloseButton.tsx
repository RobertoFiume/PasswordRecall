import * as React from 'react'
import { Colors, Icon, ThemeContext } from "@infominds/react-native-components";
import { TouchableOpacity } from 'react-native';

export default function ModalCloseButton(props: { onPress: any }) {
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <Icon name='x' size={28} color={theme.text} style={{ alignSelf: 'flex-end' }}></Icon>
        </TouchableOpacity>
    )

}

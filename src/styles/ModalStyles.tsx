
import { StyleSheet } from 'react-native';
import { Layout } from '@infominds/react-native-components'

export default StyleSheet.create({
    content: {
        height: 'auto',
        maxHeight: '100%',
        width: Layout.isLargeDevice ? '96%' : '100%',
        marginLeft: Layout.isLargeDevice ? '2%' : '0%'
    }
});

export const backdropOpacity = 0.8;
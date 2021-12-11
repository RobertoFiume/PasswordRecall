import * as React from 'react'
import { Colors } from "@infominds/react-native-components";
import { View, StyleSheet } from 'react-native';

export default function Separator() {
    return (
        <View style={styles.separator}></View>
    )
}

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        marginVertical: 5,
        borderBottomColor: Colors.icon,
    }
});

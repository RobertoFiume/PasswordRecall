import * as React from 'react'
import { Colors, ThemeContext, View, Text, Icon, CardBasic } from "@infominds/react-native-components";
import { useContext } from "react";
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function MaterialCard(props: {
    title: string,
    description: string,
    jobType: string,

    onSubmit: () => void,
    onDelete: () => void,
    deletemode: boolean,

    style?: any
}) {
    const colorScheme = useContext(ThemeContext);
    const theme = Colors[colorScheme];

    return (
        <TouchableOpacity onPress={() => { if (!props.deletemode) props.onSubmit() }}>
            <CardBasic style={{ paddingVertical: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <View style={{ margin: 5, maxWidth: '75%', minHeight: 50 }}>
                    <Text style={{ fontWeight: 'bold' }}>{props.title}</Text>
                    {!!props.jobType && <Text>{props.jobType}</Text>}
                </View>

                {props.deletemode ?
                    <TouchableOpacity onPress={props.onDelete} style={styles.deletebutton}>
                        <Icon
                            size={30}
                            name={'trash'}
                            color={theme.background} />
                    </TouchableOpacity>
                    :
                    <Text style={{ alignSelf: 'center', textAlign: 'right', fontWeight: 'bold', fontSize: 25, flex: 2 }}>{props.description}</Text>
                }
            </CardBasic>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    deletebutton: {
        backgroundColor: '#eb5757',
        margin: -1,
        marginRight: -13,
        width: 70,
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

import * as React from 'react'
import { View, Text, CardBasic } from "@infominds/react-native-components";
import { StyleSheet, TouchableOpacity } from 'react-native';
import Moment from 'moment'
import { formatPriceString } from '../utils/PriceUtils';

export default function PasswordCard(
    props: {
        id?: string,
        title?: string,
        categoryid?: string,
        description?: string,
        username?: string,
        password?: string,
        note?: string | JSX.Element,
        pincode?: string ,
        url?: string | JSX.Element,
        date?: any,

        onCardPress: () => void,
        onArrowPress?: () => void,
        hasDot: boolean,
        style?: any,
        noIcon?: boolean,
        disabled?: boolean,
        status?: 'pending' | 'blacklisted'
    }) {
    const { style, ...otherProps } = props;

    return (
        <CardBasic style={[style, props.disabled ? { opacity: 0.5 } : {}]} {...otherProps}>
            <TouchableOpacity onPress={() => { if (!props.disabled) props.onCardPress?.() }} style={[styles.card]}>
                <View style={{ flex: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {props.hasDot &&
                            <View style={styles.dot} />
                        }
                        <Text style={{ fontWeight: 'bold', fontSize: 18, flexWrap: 'wrap' }}>{props.title}</Text>
                    </View>
                    <View style={{ marginTop: 0 }}>
                        {/* {props.desc ? <Text>{props.desc}</Text> : <></>} */}
                        {props.url ? <Text style={{ marginTop: 0, flexWrap: 'wrap' }}>{props.url}</Text> : <></>}
                        {/*props.note ? <Text style={{ marginTop: 0, flexWrap: 'wrap' }}>{props.note}</Text> : <></>*/}
                        {props.date ? <Text style={{ marginTop: 0, flexWrap: 'wrap' }}>{Moment(props.date).format('DD/MM/YYYY')}</Text> : <></>}
                    </View>
                </View>
                <Text style={{ alignSelf: 'center', textAlign: 'right', fontWeight: 'bold', fontSize: 20, flex: 2, flexWrap: 'nowrap' }}>{formatPriceString(props.description)}</Text>

            </TouchableOpacity>
        </CardBasic>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: '#eb5757',
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 5
    }
});

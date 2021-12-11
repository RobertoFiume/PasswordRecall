import * as React from 'react'
import { ThemeContext, View, Text, Icon, InfomindsColors, CardBasic, Colors } from "@infominds/react-native-components";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useContext } from "react";
import Moment from 'moment'

export default function OperationCard(
    props: {
        title: string,
        desc?: string | JSX.Element,
        desc2?: string | JSX.Element,
        desc3?: string | JSX.Element,
        date?: any,
        onCardPress: () => void,
        onArrowPress?: () => void,
        hasDot: boolean,
        style?: any,
        noIcon?: boolean,
        disabled?: boolean,
        status?: 'pending' | 'blacklisted'
    }) {
    const colorScheme = useContext(ThemeContext);
    const { style, ...otherProps } = props;

    function getIconName() {
        switch (props.status) {
            case 'pending': return 'file-plus';
            case 'blacklisted': return 'upload-cloud';
            default: return 'arrow-right';
        }
    }

    function getColor(icon: boolean) {
        if (props.disabled) {
            return icon ? Colors.white : Colors.yellow;
        } else {
            if (icon)
                return colorScheme === 'dark' ? '#b9efd5' : InfomindsColors.main
            else
                return colorScheme === 'light' ? '#b9efd5' : InfomindsColors.main
        }
    }

    return (
        <CardBasic style={[style, props.disabled ? { opacity: 0.5 } : {}]} {...otherProps}>
            <TouchableOpacity onPress={() => { if (!props.disabled) props.onCardPress?.() }} style={[styles.card]}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {props.hasDot &&
                            <View style={styles.dot} />
                        }
                        <Text style={{ fontWeight: 'bold' }}>{props.title}</Text>
                    </View>
                    <View style={{ marginTop: 0 }}>
                        {props.desc ? <Text>{props.desc}</Text> : <></>}
                        {props.desc2 ? <Text style={{ marginTop: 0 }}>{props.desc2}</Text> : <></>}
                        {props.desc3 ? <Text style={{ marginTop: 0 }}>{props.desc3}</Text> : <></>}
                        {props.date ? <Text style={{ marginTop: 0 }}>{Moment(props.date).format('DD/MM/YYYY')}</Text> : <></>}
                    </View>
                </View>

                {(!props.noIcon) &&
                    <TouchableOpacity onPress={() => {
                        if (!props.disabled) {
                            if (props.onArrowPress)
                                props.onArrowPress();
                            else
                                props.onCardPress();

                        }
                    }}
                        style={{
                            backgroundColor: getColor(false),
                            borderRadius: 5,
                            padding: 3
                        }}>
                        <Icon
                            name={getIconName()}
                            size={30}
                            color={getColor(true)} />
                    </TouchableOpacity>
                }
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

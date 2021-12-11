import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ThemeContext, View, Icon, Text, Colors, DateTimePicker, LanguageContext, Layout } from '@infominds/react-native-components'
import Moment from 'moment';

// todo add to lib with this modifications
export default function InputDateTime(props: {
    onConfirm: (date: any) => void,
    onDelete: () => void,
    mode: "time" | "date" | "datetime",
    text?: string,
    placeholder?: string,
    editable?: boolean
    noDelete?: boolean
    value?: any,
    style?: any
}) {
    const lang = React.useContext(LanguageContext);
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        if (props.mode == 'time') {
            if (props.value) {
                handleTimeConfirm(props.value);
            } else {
                setDate('');
            }
        } else {
            if (props.value && !isNaN(props.value)) {
                handleTimeConfirm(props.value);
            } else {
                setDate('');
            }
        }
    }, [props.value]);

    function handleTimeConfirm(selectedDate: any) {
        let formatString = 'DD/MM/yyyy'; // date
        if (props.mode === 'time')
            formatString = 'HH:mm';

        const dateString = Moment(selectedDate).format(formatString);

        setDate(dateString)
        setTimePickerVisible(false);
    }

    return (
        <View>
            <TouchableOpacity onPress={() => { if (props.editable !== false) setTimePickerVisible(true) }}
                style={[{
                    backgroundColor: theme.inputBackground, borderColor: theme.inputBorder
                }, styles.button, props.style, Layout.defaultComponentsStyles]}>
                {!date ?
                    <Text style={{ color: props.text ? theme.text : theme.textPlaceholder, margin: 0 }}>
                        {props.text ?? props.placeholder ?? lang.SELECT_PLACEHOLDER}
                    </Text>
                    :
                    <Text style={{ color: theme.text, margin: 2 }}>
                        {props?.text} {date}
                    </Text>
                }

                {date && !props.noDelete ?
                    <TouchableOpacity
                        onPress={() => {
                            setDate('');
                            props.onDelete?.();
                        }}
                        style={{ padding: 5, marginLeft: 0, margin: -10 }}>
                        <Icon
                            style={{ color: theme.text, marginTop: 5 }}
                            name={'x'}
                            size={25}
                            color={theme.text}
                        />
                    </TouchableOpacity>
                    :
                    <Icon
                        style={{ marginLeft: 8, color: theme.text, marginVertical: Platform.OS === 'ios' ? -5 : 0 }}
                        name={props.mode === 'time' ? 'clock' : 'calendar'}
                        size={22}
                        color={theme.text}
                    />
                }
            </TouchableOpacity>

            <DateTimePicker
                mode={props.mode}
                style={{}}
                isVisible={isTimePickerVisible}
                onCancel={() => setTimePickerVisible(false)}
                onConfirm={(newDate: any) => {
                    handleTimeConfirm(newDate);
                    props.onConfirm(newDate);
                }}
                close={() => setTimePickerVisible(false)}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
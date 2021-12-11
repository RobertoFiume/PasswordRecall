import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext, Colors, LanguageContext } from '@infominds/react-native-components';
import Moment from 'moment';

// TODO add to starter for demostration
export default function InputDateTime(props: {
    onConfirm: (date: any) => void,
    onDelete: () => void,
    mode: "time" | "date" | "datetime",
    text?: string,
    editable?: boolean
    noDelete?: boolean
    value?: any,
    style?: any
}) {
    const lang = React.useContext(LanguageContext);
    const colorScheme = useContext(ThemeContext);
    const theme = Colors[colorScheme];

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
        let formatString = 'yyyy-MM-DD'; // date
        if (props.mode === 'time')
            formatString = 'HH:mm';

        console.log(selectedDate);

        const dateString = Moment(selectedDate).format(formatString);

        setDate(dateString);
    }

    return (
        <input
            placeholder={lang.SELECT_PLACEHOLDER}
            type={props.mode}
            style={{
                color: theme.text,
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                padding: 12,
                borderWidth: 1,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 5
            }}
            value={date}
            onChange={ndate => {
                if (props.mode === 'date') {
                    handleTimeConfirm(ndate.target.valueAsDate)
                }
                props.onConfirm(ndate.target.valueAsDate)
            }}
        />
    )
}
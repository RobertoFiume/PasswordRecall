import { Layout, ThemeContext } from '@infominds/react-native-components';
import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput as DefaultTextInput, Text } from 'react-native';
import { Colors } from '../constants/Colors';

type Props = {
    symbol: string | undefined;
    resetValue?: string;
};

export type TextInputProps = Props & DefaultTextInput['props'];

export default function CurrencyInput(props: TextInputProps) {
    const colorScheme = useContext(ThemeContext);
    const theme = Colors[colorScheme];
    let { style, value, ...otherProps } = props;

    React.useEffect(() => {
        console.log(Number(props.resetValue?.replace(/\,/g, '.')))
        if (Number(props.resetValue?.replace(/\,/g, '.')) != 0)
            setAmount(Number(props.resetValue?.replace(/\,/g, '.')).toFixed(2).replace(/\./g, ','))
    }, [props.resetValue]);

    const [amount, setAmount] = useState(Number(value?.replace(/\,/g, '.')).toFixed(2).replace(/\./g, ','))

    const [isSymbolVisible, setIsSymbolVisible] = useState(true)
    return (
        <DefaultTextInput
            style={[
                styles.input,
                Layout.defaultComponentsStyles,
                {
                    color: theme.text,
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder
                },
                style]}
            keyboardType={'decimal-pad'}
            placeholderTextColor={theme.textPlaceholder}
            onTouchStart={() => {
                setIsSymbolVisible(false);
                if (amount == "0,00")
                    setAmount("");
            }}
            onEndEditing={() => {
                setIsSymbolVisible(true);
                setAmount(Number(value?.replace(/\,/g, '.')).toFixed(2).replace(/\./g, ','))
            }}
            {...otherProps}
        >
            <Text>{amount}</Text>
            {props?.symbol && isSymbolVisible && value && value != '' ?
                <Text style={{ color: theme.textPlaceholder }}>{' ' + props?.symbol}</Text>
                : <></>
            }
        </DefaultTextInput>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    }
});
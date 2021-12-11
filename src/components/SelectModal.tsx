import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext, View, Icon, Text, Colors, List, LanguageContext, Layout } from '@infominds/react-native-components'
import ContentModal from "./ContentModal";

export default function SelectModal(props: {
    data: any,
    searchString: (item: any) => string,
    renderSelected: (item: any) => string
    renderItemContent: ({ item, index }: any) => JSX.Element,
    onDelete?: () => void,
    onSelect?: (item: any) => void,
    placeholder?: string,
    editable?: boolean
    noDelete?: boolean
    value?: any,
    style?: any
}) {
    const lang = React.useContext(LanguageContext);
    const colorScheme = React.useContext(ThemeContext);
    const theme = Colors[colorScheme];

    const [selected, setSelected] = useState();

    const [isModalBottomVisible, setModalBottomVisible] = useState(false);
    const toggleModalBottom = () => setModalBottomVisible(!isModalBottomVisible);

    useEffect(() => {
        // if (!selected) {
        setSelected(props.value)
        // }
    }, [props.value, selected]);

    return (
        <View>
            <TouchableOpacity onPress={() => { if (props.editable !== false) toggleModalBottom() }}
                style={[{
                    backgroundColor: theme.inputBackground, borderColor: theme.inputBorder
                }, styles.button, props.style, Layout.defaultComponentsStyles]}>
                {selected ?
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ margin: 0 }}>{props.renderSelected(selected)}</Text>
                        {!props.noDelete &&
                            <TouchableOpacity
                                style={{ padding: 5, margin: -10 }}
                                onPress={() => { setSelected(undefined); props.onDelete?.() }}>
                                <Icon name='x' size={25} color={theme.text} />
                            </TouchableOpacity>
                        }
                    </View>
                    :
                    <Text style={{ color: theme.textPlaceholder, margin: 0 }}>{props.placeholder ?? lang.SELECT_PLACEHOLDER}</Text>
                }
            </TouchableOpacity>

            <ContentModal
                isVisible={isModalBottomVisible}
                close={toggleModalBottom}
                style={{}}
                content={() =>
                    <List
                        data={props.data}
                        renderItem={({ item, index }: any) => (
                            <TouchableOpacity onPress={() => { setSelected(item); toggleModalBottom(); props.onSelect?.(item) }}>
                                {props.renderItemContent({ item, index })}
                            </TouchableOpacity>
                        )}
                    />
                }
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

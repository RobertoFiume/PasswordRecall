import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Icon, Text, Colors, LanguageContext, SearchList, Card, CardBasic } from '@infominds/react-native-components'
import ContentModal from "./ContentModal";
import getWebIcon from "../utils/IconUtil";

export default function SearchModal(props: {
    text: string,
    data: any,
    renderSelected: (item: any, toggleModalBottom: any) => JSX.Element,
    searchString: (item: any) => string,
    renderItemContent: ({ item, index }: any) => JSX.Element,
    onSelect?: (item: any) => void,
    onDelete?: () => void,
    value?: any,
    editable?: boolean
    style?: any,
    icon?: string
}) {
    const lang = useContext(LanguageContext);

    const [selected, setSelected] = useState();

    const [isModalBottomVisible, setModalBottomVisible] = useState(false);
    const toggleModalBottom = () => setModalBottomVisible(!isModalBottomVisible);

    useEffect(() => {
        setSelected(props.value)
    }, [props.value, selected]);

    return (
        <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {props.icon &&
                    <TouchableOpacity
                        onPress={() => { if (props.editable !== false) toggleModalBottom() }}
                        style={styles.icon}>
                        {Platform.OS === 'web' ?
                            <Icon
                                name={getWebIcon(props.icon)}
                                size={40}
                                color={Colors.white} />
                            :
                            <Icon
                                family='FontAwesome5'
                                name={props.icon}
                                size={40}
                                color={Colors.white} />
                        }
                    </TouchableOpacity>
                }
                {selected ?
                    props.renderSelected(selected, toggleModalBottom)
                    :
                    <Text
                        style={[{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 'bold', paddingTop: 10, paddingBottom: 10 }, props.style]}
                        onPress={() => { if (props.editable !== false) toggleModalBottom() }} >
                        {props.text}
                    </Text>
                }
            </View>

            <ContentModal
                isVisible={isModalBottomVisible}
                close={toggleModalBottom}
                style={{ height: '90%' }}
                content={() =>
                    <View style={{ flex: 1, justifyContent: 'space-between' }} >
                        <View style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginBottom: 20 }}>{props.text}</Text>

                            {selected &&
                                <Text
                                    style={{ marginBottom: 20, color: Colors.red }}
                                    onPress={() => {
                                        setSelected(undefined);
                                        toggleModalBottom();
                                        props.onDelete?.();
                                    }}>
                                    {lang.REMOVE_SELECTION}
                                </Text>
                            }
                        </View>

                        <View style={{ height: '100%' }}>
                            <SearchList
                                data={props.data}
                                searchString={props.searchString}
                                renderItem={({ item, index }: any) => (
                                    <CardBasic>
                                        <TouchableOpacity onPress={() => { setSelected(item); toggleModalBottom(); props.onSelect?.(item) }}>
                                            {props.renderItemContent({ item, index })}
                                        </TouchableOpacity>
                                    </CardBasic>
                                )}
                            />
                        </View>

                    </View>
                } />
        </View >
    );
}


const styles = StyleSheet.create({
    icon: {
        backgroundColor: Colors.grey,
        marginRight: 10,
        borderRadius: 8,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        marginLeft: 5
    }
});
import { Icon, View, Colors, Layout } from '@infominds/react-native-components';
import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
// import AudioPicker from './AudioPicker';
import ImagePicker from './ImagePicker';
import MediaPlayer from './MediaPlayer';

const WIDTH = (Layout.window.width - 20) / 2;

export default function MediaGrid(props: { onDataChange: any }) {
    const [data, setData] = useState<any[]>([]);
    const [current, setCurrent] = useState<any>();

    return (<>
        <View>
            <FlatGrid
                itemDimension={WIDTH - 25}
                data={data}
                renderItem={({ item, index }) => (
                    <ImageBackground
                        style={{ borderRadius: 10, overflow: 'hidden', height: WIDTH, width: WIDTH - 20 }}
                        resizeMode='cover'
                        source={item}>
                        <TouchableOpacity
                            onPress={() => { setCurrent(undefined); setCurrent(item); }}
                            style={{ backgroundColor: (item.type === 'audio') ? Colors.tint : 'transparent', borderRadius: 10, padding: 7 }}>
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end', backgroundColor: '#fff', borderRadius: 15, marginLeft: 10, marginBottom: 10, padding: 7 }}
                                onPress={() => {
                                    data.splice(index, 1);
                                    setData([...data]);
                                    props.onDataChange([...data])
                                    setCurrent(undefined);
                                }}>
                                <Icon family='FontAwesome5' name='trash' color={Colors.black} size={20} />
                            </TouchableOpacity>

                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 200, paddingBottom: 60 }}>
                                {(item.type === 'audio') && <Icon name='mic' size={50} />}
                                {!item.type && <Icon name='play' size={50} />}
                            </View>
                        </TouchableOpacity>
                    </ImageBackground>
                )}
            />
        </View>

        <MediaPlayer source={current} onClose={() => setCurrent(undefined)} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
            {/* @ts-ignore */}
            <ImagePicker
                preview={false}
                onSelect={(selected) => {
                    //console.log(selected.assets);
                    //@ts-ignore
                    props.onDataChange([...selected.assets, ...data])
                    //@ts-ignore
                    setData([...selected.assets, ...data]);
                }} videoEnabled={false} />
            {/* <AudioPicker preview={false} onSelect={selected => setData([selected, ...data])} /> */}
        </View>
    </>);
}
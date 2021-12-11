import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Colors } from '@infominds/react-native-components';

export interface SliderData {
    title: string;
    text: string;
    image: any;
}

export default function IntroSlider(props: { data: SliderData[], onDone: () => void }) {

    useEffect(() => {
        AsyncStorage.getItem('intro').then(intro => {
            if (intro) props.onDone();
        });
    }, []);

    function saveAndClose() {
        AsyncStorage.setItem('intro', 'true');
        props.onDone();
    }

    const RenderItem = ({ item }: { item: SliderData }) => (
        <View style={[introStyles.slide, Platform.OS !== 'web' ? { flex: 1 } : {}, { backgroundColor: Colors.tint }]}>
            <Text style={introStyles.title}>{item.title}</Text>
            <Image source={item.image} style={introStyles.image} />
            <Text style={introStyles.text}>{item.text}</Text>
        </View>
    )

    return (
        <AppIntroSlider
            showSkipButton
            renderItem={RenderItem}
            data={props.data}
            onSkip={saveAndClose}
            onDone={saveAndClose}
        />
    )
}

const introStyles = StyleSheet.create({
    slide: {
        alignItems: 'center',
        justifyContent: 'center',
        height: window.innerHeight
    },
    image: {
        width: 320,
        height: 320,
        marginVertical: 32,
    },
    text: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    },
});

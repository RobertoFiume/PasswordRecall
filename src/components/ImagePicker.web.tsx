import React from 'react';
import { View } from '@infominds/react-native-components';
import { ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';

export default function ImagePicker(props: { options?: ImageLibraryOptions, preview?: boolean, onSelect?: (response: ImagePickerResponse) => void }) {

    return (
        <View>
            {/* <Text>No web implementation yet</Text> */}
        </View>
    );
}
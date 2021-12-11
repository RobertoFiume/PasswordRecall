import * as React from 'react'
import { Text } from "@infominds/react-native-components";

export default function Label(lableProps: { text: string, required?: boolean }) {
    return (
        <Text style={{ marginTop: 20 }}>{lableProps.text}{(lableProps.required ?? false) && '*'}</Text>
    )

}

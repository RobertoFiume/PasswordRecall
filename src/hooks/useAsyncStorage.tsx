import AsyncStorage from "@react-native-community/async-storage";


export default function useStorage() {
    return {
        save: async (value: any) => {
            try {
                const jsonValue = JSON.stringify(value)
                AsyncStorage.setItem('@storage_Key', jsonValue)
            } catch (e) {
                console.error(e);
            }
        },
        load: async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@storage_Key')
                return jsonValue != null ? JSON.parse(jsonValue) : null;
            } catch (e) {
                console.error(e);
            }
        }
    }
}
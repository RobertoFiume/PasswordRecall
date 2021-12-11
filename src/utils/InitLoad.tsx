import getLanguage from "../constants/Languages";
import AsyncStorage from "@react-native-community/async-storage";

export default async function InitLoad(setLanguage: any, setTheme: any) {
    await AsyncStorage.getItem('lang')
        .then(lang => {
            if (lang) {
                setLanguage(getLanguage(lang));
            }
        });

    await AsyncStorage.getItem('theme')
        .then((theme) => {
            if (theme != null) {
                setTheme(theme);
            }
        });
}
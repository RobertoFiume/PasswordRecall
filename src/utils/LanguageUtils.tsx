import { NativeModules, Platform } from 'react-native'
import detectBrowserLanguage from 'detect-browser-language'

import de from '../assets/languages/de.json';
import en from '../assets/languages/en.json';
import it from '../assets/languages/it.json';

export default function getSystemLanguage() {

    let locale;
    if (Platform.OS === 'ios')
        locale = NativeModules.SettingsManager.settings.AppleLocale
    else if (Platform.OS === 'android')
        locale = NativeModules.I18nManager.localeIdentifier;
    else
        locale = detectBrowserLanguage();

    if (!locale)
        locale = 'de';
    locale = locale.substring(0, 2);
    return locale;

}

export function getLanguageJSON(local: string) {
    switch (local) {
        case 'en':
            return en;
        case 'de':
            return de;
        case 'it':
            return it;
        default:
            return en;
    }
}
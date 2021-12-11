import getSystemLanguage, { getLanguageJSON } from '../utils/LanguageUtils'

export default function getLanguage(changeLangTo = '') {

    let locale;
    if (changeLangTo === '')
        locale = getSystemLanguage();
    else
        locale = changeLangTo;

    return getLanguageJSON(locale)
}
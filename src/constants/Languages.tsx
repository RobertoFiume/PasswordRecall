const de = require('../assets/languages/de.json');
const en = require('../assets/languages/en.json');
const it = require('../assets/languages/it.json');

export default function getLanguage(lang: string) {

    switch (lang) {
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
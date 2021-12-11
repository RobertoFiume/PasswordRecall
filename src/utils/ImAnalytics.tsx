
import Analytics from 'appcenter-analytics';
import { Platform } from 'react-native';

export default {
    trackEvent: (eventName: string, properties?: { [name: string]: string }): Promise<void> | undefined => {
        if (Platform.OS !== 'web')
            return Analytics.trackEvent(eventName, properties);
    }
}
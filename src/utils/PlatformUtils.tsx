import { Platform } from "react-native";

type OS = "ios" | "android" | "windows" | "macos" | "web";

function isOS(...oslist: OS[]) {
    let ret = false;
    oslist.forEach(os => {
        if (Platform.OS === os) ret = true;
    });
    return ret;
}

function isMobile() { return isOS('android', 'ios') }
function isWeb() { return isOS('web') }
function isDesktop() { return isOS('macos', 'windows') }

export { isOS, isMobile, isWeb, isDesktop }
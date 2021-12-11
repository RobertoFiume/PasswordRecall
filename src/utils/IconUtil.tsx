
const lookUp: any = {
    'building': 'briefcase',
    'hard-hat': 'truck',
    'wrench': 'tool',
    'user': 'user'
}
export default function getWebIcon(name: string) {
    return lookUp[name];
}
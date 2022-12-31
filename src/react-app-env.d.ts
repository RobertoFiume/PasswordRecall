/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'react-web-vector-icons'

declare module 'react-dark-mode-toggle'

declare module 'react-native-vector-icons/dist/Feather'
declare module 'react-native-vector-icons/dist/FontAwesome5'

declare module 'react-native-screens'

declare module 'detect-browser-language'

declare module 'modal-react-native-web'

declare module '@react-native-community/picker'

//declare module '@infominds/react-native-license'

declare module 'radio-buttons-react-native'

declare module '@iarna/rtf-to-html';

declare module 'react-native-base64';

declare module 'react-native-use-keyboard-height';

declare module 'react-native-text-detector';

declare module 'react-native-image-base64';
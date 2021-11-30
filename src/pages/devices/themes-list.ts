// Sensor 5

import Six from './themes/theme-six';
import Five from './themes/theme-five';
import Four from './themes/theme-four';
import Three from './themes/theme-three';
import { ThemeData } from './themes/theme';

type IThemeList = { [key: number]: ThemeData[] }

const ThemeList: IThemeList = {
    600: [
        ...Six
    ],
    500: [
        ...Five
    ],
    400: [
        ...Four
    ],
    300: [
        ...Three
    ]
}


export default ThemeList;

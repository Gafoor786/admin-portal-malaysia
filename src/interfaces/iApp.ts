import { Theme } from "../data/constants";

export interface IAppSettings {
    theme: Theme,
    isDarkTheme: boolean
}


export const InitialAppSettings: IAppSettings = {
    theme: Theme.Auto,
    isDarkTheme: false
}
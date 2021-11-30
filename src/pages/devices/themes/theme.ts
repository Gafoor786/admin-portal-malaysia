export enum ThemeChooser {
    Dark,
    Light
}

export interface ThemeData {
    id: number,
    name: string,
    img: any,
    theme: ThemeChooser
}
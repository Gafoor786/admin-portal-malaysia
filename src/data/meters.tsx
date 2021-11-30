import { Meter } from "../interfaces/Meter";



const meters: Meter[] = [
    {
        id: 1,
        name: 'TPR - 345'
    },
    {
        id: 2,
        name: 'TPR - 610'
    },
    {
        id: 3,
        name: 'TPR - 300'
    },
    {
        id: 4,
        name: 'TPR - 615'
    },
    {
        id: 5,
        name: 'TPR - 612'
    }
];

export const getAllMeters = async () => {
    return new Promise<Meter[]>(async (resolve) => {
        // let r = await fetch(`${BASE_URL}/posts/${postId}/comments`);
        // let data = await r.json();
        let data = [...meters];
        setTimeout(() => resolve(data), 1000);
    });
};

export const getMeterDetails = async (meterId: number) => {
    return new Promise<Meter | null>(async (resolve) => {
        // let r = await fetch(`${BASE_URL}/posts/${postId}/comments`);
        // let data = await r.json();
        let data = [...meters].find(c => c.id === meterId);
        setTimeout(() => resolve(data === undefined ? null : data), 1000);
    });
};
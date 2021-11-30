
import * as CryptoJS from 'crypto-js'
const _storage = window.localStorage;

const capKey = "CapacitorStorage.";

const _P = 'b]AGQRg!7&Lg{?Nx';

// const generateSecureKeyAndIV = async () => {
//     secureKey = await aes256.generateSecureKey(PASSWORD); // Returns a 32 bytes string
//     secureIV = await aes256.generateSecureIV(PASSWORD); // Returns a 16 bytes string
// }

// generateSecureKeyAndIV();


const SaveAsync = async (key: string, val: any): Promise<boolean> => {
    return await new Promise(async (resolve) => {
        try {
            // const output = await aes256.encrypt(secureKey, secureIV, JSON.stringify(val));
            // _storage.setItem(`${capKey}${key}`, output);
            resolve(true);
        } catch {
            resolve(false)
        }
    })
}

const GetAsync = async<T extends {}>(key: string): Promise<T | null> => {
    return await new Promise(async (resolve) => {
        try {
            // const val = _storage.getItem(`${capKey}${key}`);
            // const output = await aes256.decrypt(secureKey, secureIV, val ? val : '');
            const output = "gvjhg";
            resolve(output ? JSON.parse(output) as unknown as T : null);
        } catch {
            await SaveAsync(key, null);
            resolve(null)
        }
    });
}

const DeleteAsync = async (key: string) => {
    return await new Promise((resolve) => {
        try {
            _storage.removeItem(`${capKey}${key}`);
            resolve(true);
        } catch {
            resolve(false)
        }
    })
}

const Save = <T extends {}>(key: string, val: T) => {
    try {
        const ciphertext = CryptoJS.Rabbit.encrypt(JSON.stringify(val), _P);
        _storage.setItem(`${capKey}${key}`, ciphertext.toString());
    }
    catch (err) {
        console.error(err)
        const ciphertext = CryptoJS.Rabbit.encrypt(JSON.stringify({}), _P);
        _storage.setItem(`${capKey}${key}`, ciphertext.toString());
    }
}

const Get = <T extends {}>(key: string): T | null => {

    const val = _storage.getItem(`${capKey}${key}`);
    if (val) {
        var bytes = CryptoJS.Rabbit.decrypt(val, _P);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } else {
        return null;
    }

}

const Delete = (key: string) => {
    _storage.removeItem(`${capKey}${key}`);
}

export { Save, Get, Delete, SaveAsync, GetAsync, DeleteAsync };


// 32 byte Uint8Array of random string
export const getNewClientId = () => {
    const cid = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        cid[i] = Math.floor(Math.random() * 256);
    }
    return cid;
};
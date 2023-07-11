//simulating API call to our DB for now

export const getXbcAndSess = async (user_id: string) => {
    return {
        xbc: process.env.XBC,
        sess: process.env.OF_SESS,
    }
}
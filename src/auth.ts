const prompt = require('prompt');

import API_mtproto from './api/mtproto';

/**
 * Процедура авторизации. 
 * См. https://mtproto-core.js.org/docs/user-authorization.
 */
export const authorize = async (api: API_mtproto) => {
    const user = await api.getSelf();
    console.log(JSON.stringify(user));
    if (!user) {
        const phone_number = process.env.USER_PHONE_NUMBER;
        const { phone_code_hash } = await api.sendCode(phone_number);
        prompt.start();
        const { phone_code } = await prompt.get(['phone_code']);

        try {
            const signInResult = await api.signIn(phone_code, phone_number, phone_code_hash);
            if (signInResult._ === 'auth.authorizationSignUpRequired') {
                console.log('Error: аккаунта с таким номером не существует');
                process.exit();
            }
        } catch (error) {
            if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
                console.log(`Error:`, error);
                return;
            }

            // 2FA
            const password = process.env.USER_TG_CLOUD_PASSWORD;
            const { srp_id, current_algo, srp_B } = await api.getPassword();
            const { g, p, salt1, salt2 } = current_algo;
            const { A, M1 } = await api.mtproto.crypto.getSRPParams({ g, p, salt1, salt2, gB: srp_B, password });
            const checkPasswordResult = await api.checkPassword({ srp_id, A, M1 });
            if (checkPasswordResult) {
                console.log('Authentication successful after entering 2FA');
            }
        }
    }
}

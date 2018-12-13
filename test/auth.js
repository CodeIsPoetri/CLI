'use strict';

const { Auth: API } = require('../lib/api');
const Token = require('../lib/token');

describe('Auth', () => {
    const user = {
        username: 'jdoe',
        firstName: 'John',
        lastName: 'Doe',
        mail: 'doe@example.com',
        password: 'im-john-doe',
        sshPublicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDQHG8c9zz8ye6XQO0u+4TnscuQq+8P5lFx7d5lLqZ6vIw2O76EgDQpoMgaWJwZeRZGviafbVFeqtKgmaku68U2yJ+e/k+8IGYMf3fqL8aR+tSz2Tx0SCjlPRk+iTWVihspbhWk2X16CdFxuwFjGvqyHC7VkoyBWL/MQ/C8HeMfHsf5XzVHww53cQikLfEENxXsNw8ExHha9VLLTiLmc6grPO5tmyAadFLFhPKDSWcxT5JabCQiWSSpoOWDUmdwIfoomEKB64pG76XXVLLjcXC7yoaiiqvCix+4uJ+vSdXIbc3ouE3aPHJhJKpAxyeLgvygphUfB/wPdAmSnwo8OKmV'
    };

    it('#register', () => expect(AuthApi.register(user))
        .to.eventually.be.fulfilled);

    it('#login', async () => {
        await AuthApi.login(user.mail, user.password);
        return expect(Token.get()).to.be.ok;
    });
});
"use strict";

const url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/auth/login';

exports.loginUser = (username, password) => {
    return new Promise((resolve, reject) => {

        const requestObj = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                username: 'dev',
                password: 'topiadev'
            })
        };

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
                reject(err);
        });
    });
};
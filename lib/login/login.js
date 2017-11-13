"use strict";

const url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/auth/login';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
};

exports.loginUser = (username, password) => {
    return new Promise((resolve, reject) => {

        const params = {
            username: username,
            password: password,
        };

        let body = [];

        for(let property in params) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(params[property]);

            body.push(encodedKey + "=" + encodedValue);
        }

        body = body.join("&");

        const requestObj = {
            method: 'POST',
            headers: headers,
            body: body
        };

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
                reject(err);
        });
    });
};
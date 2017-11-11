"use strict";

const url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/auth/register';

exports.registerUser = (first, last, email, password) => {
    return new Promise((resolve, reject) => {

        const requestObj = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test',
                email: 'test'
            })
        };

        fetch(url, requestObj)
            .then(res => {
                resolve(res.text());
            }).catch(err => {
                reject(err);
        });
    });
};
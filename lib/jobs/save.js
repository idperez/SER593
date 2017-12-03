"use strict";

let save = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/users/savejob';
let remove = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/users/removejob';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer topiadev'
};

exports.saveJob = (jobkey) => {
    return new Promise((resolve, reject) => {

        const params =  {
            "jobkey": jobkey
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

        fetch(save, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
            reject(err);
        });
    });
};

exports.removeJob = (jobkey) => {
    return new Promise((resolve, reject) => {

        const params =  {
            "jobkey": jobkey
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

        fetch(remove, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
            reject(err);
        });
    });
};
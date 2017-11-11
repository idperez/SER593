"use strict";

const url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/search/jobs/bykey?jobkeys=455ba8b70208e25b';

exports.getJobInformation = () => {
    return new Promise((resolve, reject) => {

        const requestObj = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer topiadev'
            }
        };

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
                reject(err);
        });
    });
};
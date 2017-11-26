"use strict";

let url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/users/modifymulti?username=dev';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer topiadev'
};

exports.setProfile = (jobTitles, type, datePosted) => {
    return new Promise((resolve, reject) => {

        const params =  {
            "username": "dev",
            "prefs": {
                "prefs_jobs_titles": [
                    "Software Developer"
                ],
                "prefs_jobs_postedDate": 60
            }
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
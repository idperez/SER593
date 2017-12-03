"use strict";

let url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/users/modifymulti';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer topiadev'
};

exports.setProfile = (jobTitles, type, datePosted) => {
    return new Promise((resolve, reject) => {

        let params =  {
            "prefs_jobs_titles": [
                jobTitles
            ],
            "prefs_jobs_types": [
                type
            ],
            "prefs_jobs_postedDate": datePosted
        };

        let requestObj = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        };

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
            reject(err);
        });
    });
};
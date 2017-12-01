"use strict";

exports.getCompanyInfo = (company) => {
    return new Promise((resolve, reject) => {
        const requestObj = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer topiadev'
            }
        };

        let url = `http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/search/jobs/companyinfo?companyname=${company}`;

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
            reject(err);
        });
    });
};
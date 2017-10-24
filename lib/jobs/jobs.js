"use strict";

let url = 'http://topia-env.ec2n87mrb8.us-west-2.elasticbeanstalk.com/search/jobs/bykey?jobkeys=455ba8b70208e25b';

exports.getJobInformation = function(){
    return new Promise(function(resolve, reject) {

        let requestObj = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer topiadev'
            }
        };

        fetch(url, requestObj)
            .then(function(res) {
                return res.json();
            })
            .then(function(resJson) {
                resolve(resJson);
        });
    });
};
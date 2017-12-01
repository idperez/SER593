"use strict";

exports.getRecruitingVideo = (company) => {
    return new Promise((resolve, reject) => {
        const requestObj = {
            method: 'GET'
        };

        company = company.split(" ").join("%20");

        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet%2C+id&maxResults=6&q=${company}%20careers&type=video&key=AIzaSyAEtLBeeFTxB_D-EX_Wo4U-kqov5nprVXQ`;

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
            reject(err);
        });
    });
};

exports.getCompanyVideo = (company) => {
    return new Promise((resolve, reject) => {
        const requestObj = {
            method: 'GET'
        };

        company = company.split(" ").join("%20");

        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet%2C+id&maxResults=6&q=${company}&type=video&key=AIzaSyAEtLBeeFTxB_D-EX_Wo4U-kqov5nprVXQ`;

        fetch(url, requestObj)
            .then(res => {
                resolve(res.json());
            }).catch(err => {
            reject(err);
        });
    });
};
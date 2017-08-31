var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder();

module.exports = api;

api.get('/test', function () {
    var json = {
	    "G":"I",
	    "Number":3,
	    "Isid":"shhh"
    }
    return json;
});

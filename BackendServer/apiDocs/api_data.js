define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login",
    "name": "Login",
    "group": "Authentication",
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/auth/login",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Example:",
          "content": "{\n  \"username\": \"freddy123\",\n  \"password\": \"pw123456\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorGettingProfile",
            "description": "<p>Cannot find profile associated with username during authentication.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PasswordMismatch",
            "description": "<p>Password was incorrect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"PasswordMismatch\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "token",
            "description": "<p>Access token assigned to user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"token\": \"QZ3jhbfdof84GFBlSe\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/logout/",
    "title": "Logout",
    "name": "Logout",
    "group": "Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/auth/logout",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"TokenNotFound\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "Register",
    "name": "Register",
    "group": "Authentication",
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/auth/register",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Example:",
          "content": "{\n  \"username\": \"freddy123\",\n  \"password\": \"pw123456\",\n  \"email\": \"freddy123@gmail.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformation",
            "description": "<p>Username or password is missing</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UsernameTaken",
            "description": "<p>There is already an account with the supplied username.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorGettingProfile",
            "description": "<p>Cannot find profile associated with username during authentication.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"UsernameTaken\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "token",
            "description": "<p>Access token assigned to user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"token\": \"QZ3jhbfdof84GFBlSe\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/housing/details/:rangekey",
    "title": "House Details",
    "name": "HouseDetails",
    "group": "Housing",
    "description": "<p>Get more details about a specific house.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/housing/details/0 CaddoHouston\npath-to-topia-api.com/housing/details/1022 E MONTOYA LanePhoenix",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rangekey",
            "description": "<p>The range key supplied by housing search.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n    \"Address\": \"1022 E MONTOYA LanePhoenix\",\n    \"street\": \"1022 E MONTOYA Lane\",\n    \"city\": \"Phoenix\",\n    \"state\": \"AZ\",\n    \"zip\": 85024,\n    \"type\": \"Single Family Home\",\n    \"fullBaths\": 2,\n    \"halfBaths\": 0,\n    \"beds\": 3,\n    \"detailsLink\": \"http://www.homefinder.com/AZ/Phoenix/1022-E-MONTOYA-Lane-314518307d\",\n    \"photoLink\": \"http://img4.homefinder.com/_img_/314518307/b4630c5f6a7493fe95365af3997afa22e90e15a9/200\",\n    \"lat\": 33.6723684,\n    \"long\": -112.0584192,\n    \"purchaseType\": \"buy\",\n    \"price\": 310000,\n    \"details_Description\": \"Natural light, fresh interior paint, and new carpet are a few of our favorite features at this single-story Phoenix home. Step inside and discover vaulted ceilings and a Great room. The open kitchen features a breakfast bar and overlooks the fireplace in the Living room. Travel through the back door and check out the covered patio and pool.All Opendoor homes come with a 30-day satisfaction guarantee. Terms and conditions apply.\",\n    \"details_PhotoLinks\": [\n        \"http://img1.homefinder.com/_img_/314518307/5aad30deef7b935dbc3fe5a29baf20e1de5e5ad0/592-\",\n        \"http://img1.homefinder.com/_img_/314518307/84d0380e8cc92a9d61f1c0e711939ee2912ff313/592-\",\n        \"http://img1.homefinder.com/_img_/314518307/a4c5c573abec47204bcf9797298c731f42794683/592-\",\n        \"http://img1.homefinder.com/_img_/314518307/b000d8e7092580aff054272b0fcf5035b6e262dc/592-\"\n    ],\n    \"rangeKey\": \"1022 E MONTOYA LanePhoenix\",\n    \"zillowID\": \"50181931\",\n    \"valLow\": 291868,\n    \"valHigh\": 322590,\n    \"yearBuilt\": \"1998\",\n    \"houseSize\": 1755,\n    \"lotSize\": 6688\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingRangeKey",
            "description": "<p>No range key found in request.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidHouse",
            "description": "<p>Internal error getting house information from DB.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"MissingRangeKey\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/housing.js",
    "groupTitle": "Housing"
  },
  {
    "type": "get",
    "url": "/housing",
    "title": "House Search",
    "name": "HouseSearch",
    "group": "Housing",
    "description": "<p>Get list of houses by coordinates and a range.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/housing?long=-95.26405559&lat=29.8569348&radius=20",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lat",
            "description": "<p>Latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "long",
            "description": "<p>Longitude</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "radius",
            "defaultValue": "25",
            "description": "<p>Radius in miles to search for houses.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    {\n        \"street\": \"6008 Bonn Echo Lane\",\n        \"city\": \"Houston\",\n        \"state\": \"TX\",\n        \"zip\": \"77017\",\n        \"photoLink\": \"http://img5.homefinder.com/_img_/314473599/88ae472e9230f5d1a3e0572af7384ed5411b2f03/200\",\n        \"detailsLink\": \"http://www.homefinder.com/TX/Houston/6008-Bonn-Echo-Lane-314473599d\",\n        \"price\": \"359900\",\n        \"type\": \"Single Family Home\",\n        \"fullBaths\": 3,\n        \"halfBaths\": 2,\n        \"beds\": 4,\n        \"lat\": 29.6728489,\n        \"long\": -95.25548739999999,\n        \"rangeKey\": \"6008 Bonn Echo LaneHouston\"\n    },\n    ...\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingCoordinates",
            "description": "<p>lat or long are missing.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"MissingCoordinates\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/housing.js",
    "groupTitle": "Housing"
  },
  {
    "type": "get",
    "url": "/jobs/companies/:companyname",
    "title": "Company Information",
    "name": "Company",
    "group": "Jobs",
    "description": "<p>Get company information for a job.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/jobs/companies/viasat",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "companyname",
            "description": "<p>Name of company to get information on.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n   \"id\": 3520,\n   \"name\": \"Mazda\",\n   \"website\": \"www.mazda.com\",\n   \"isEEP\": false,\n   \"exactMatch\": true,\n   \"industry\": \"Transportation Equipment Manufacturing\",\n   \"numberOfRatings\": 45,\n   \"squareLogo\": \"https://media.glassdoor.com/sqll/3520/mazda-squarelogo.png\",\n   \"overallRating\": \"3.5\",\n   \"ratingDescription\": \"Satisfied\",\n   \"cultureAndValuesRating\": \"3.2\",\n   \"seniorLeadershipRating\": \"3.0\",\n   \"compensationAndBenefitsRating\": \"3.2\",\n   \"careerOpportunitiesRating\": \"2.9\",\n   \"workLifeBalanceRating\": \"3.3\",\n   \"recommendToFriendRating\": 55,\n   \"sectorId\": 10015,\n   \"sectorName\": \"Manufacturing\",\n   \"industryId\": 200075,\n   \"industryName\": \"Transportation Equipment Manufacturing\",\n   \"ceo\": {\n       \"name\": \"Masamichi Kogai\",\n       \"title\": \"President and CEO\",\n       \"numberOfRatings\": 8,\n       \"pctApprove\": 53,\n       \"pctDisapprove\": 47,\n       \"image\": {\n           \"src\": \"https://media.glassdoor.com/people/sqll/3520/mazda-masamichi-kogai.png\",\n           \"height\": 200,\n           \"width\": 200\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCompanyName",
            "description": "<p>Company name missing from query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CompanyNotFound",
            "description": "<p>No company information was found for the given company name.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"CompanyNotFound\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/jobs.js",
    "groupTitle": "Jobs"
  },
  {
    "type": "get",
    "url": "/jobs/:jobkey",
    "title": "Job Information",
    "name": "JobByKey",
    "group": "Jobs",
    "description": "<p>Get job by key</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/jobs/455ba8b70208e25b",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobkey",
            "description": "<p>Indeed job key</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n  \"jobtitle\": \"Graduate SubSystems Engineer\",\n  \"company\": \"ARM\",\n  \"city\": \"Austin\",\n  \"state\": \"TX\",\n  \"country\": \"US\",\n  \"language\": \"en\",\n  \"formattedLocation\": \"Austin, TX\",\n  \"source\": \"ARM\",\n  \"date\": \"Wed, 20 Sep 2017 02:04:17 GMT\",\n  \"snippet\": \"Bachelors or Masters degree in Electrical/Computer Engineering or Computer Science with a 3.5+ GPA. Be motivated to continuously develop skills and accept a variety of responsibilities as part of contributing to the design center’s success. We employ leading-edge modeling, design and verification technologies to design low-power high-performance products....\",\n  \"url\": \"http://www.indeed.com/rc/clk?jk=455ba8b70208e25b&atk=\",\n  \"onmousedown\": \"indeed_clk(this,'');\",\n  \"latitude\": 30.266483,\n  \"longitude\": -97.74176,\n  \"jobkey\": \"455ba8b70208e25b\",\n  \"sponsored\": false,\n  \"expired\": false,\n  \"indeedApply\": false,\n  \"formattedLocationFull\": \"Austin, TX\",\n  \"formattedRelativeTime\": \"10 days ago\",\n  \"stations\": \"\",\n  \"recommendations\": []\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoJobsKeysFound",
            "description": "<p>jobkeys not found in query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoJobsFound",
            "description": "<p>No jobs found with the given key.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"NoJobKeyFound\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/jobs.js",
    "groupTitle": "Jobs"
  },
  {
    "type": "get",
    "url": "/jobs",
    "title": "Jobs Search",
    "name": "JobsSearch",
    "group": "Jobs",
    "description": "<p>Get jobs by supplied city-state, zip, or coordinates.</p> <p>NOTE: The returned array may contain an object with null lat/long for jobs that do not have location information.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/jobs?type=location&city=Denver&state=CO&limit=500\npath-to-topia-api.com/jobs?type=zip&zip=07853&limit=500\npath-to-topia-api.com/jobs?type=coordinates&lat=32.959613&long=-117.157757&limit=500",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"location\"",
              "\"zip\"",
              "\"coordinates\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Type of search to perform.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City to search. Req with location type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>State to search. (2 letter abbreviation). Req with location type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zip",
            "description": "<p>Zip code. Req with zip type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lat",
            "description": "<p>Latitude. Req with coordinate type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "long",
            "description": "<p>Longitude. Req with coordinate type.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Max number of results.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "radius",
            "defaultValue": "25",
            "description": "<p>Radius to search for jobs.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n   {\n       \"latitude\": null,\n       \"longitude\": null,\n       \"jobs\": [...]\n   },\n   {\n       \"latitude\": 33.277313,\n       \"longitude\": -111.88746,\n       \"jobs\": [\n           {\n               \"jobtitle\": \"Building Maintenance Engineer - First Shift\",\n               \"company\": \"CBRE\",\n               \"city\": \"Chandler\",\n               \"state\": \"AZ\",\n               \"country\": \"US\",\n               \"language\": \"en\",\n               \"formattedLocation\": \"Chandler, AZ\",\n               \"source\": \"CBRE\",\n               \"date\": \"Thu, 21 Dec 2017 05:30:22 GMT\",\n               \"snippet\": \"Contracted work includes landscaping, snow removal, remodeling, HVAC, plumbers, and cleaning. Utilizes advanced skills to perform complex preventive maintenance...\",\n               \"url\": \"http://www.indeed.com/viewjob?jk=53091387dd962a7d&qd=AHBv2aSOJz5QeLJ8HScbwNK2-_Y-B8Po8Ndci7Xy1gTc4blc9F2b1BPLA4kjCLtKl3e9F4vXNREZjAdV6uZz_x6nojn63AzuMLy1372sZMY&indpubnum=7658403343281086&atk=1c3oke17u19s92t9\",\n               \"onmousedown\": \"indeed_clk(this,'1580');\",\n               \"latitude\": 33.277313,\n               \"longitude\": -111.88746,\n               \"jobkey\": \"53091387dd962a7d\",\n               \"sponsored\": false,\n               \"expired\": false,\n               \"indeedApply\": false,\n               \"formattedLocationFull\": \"Chandler, AZ 85286\",\n               \"formattedRelativeTime\": \"23 days ago\",\n               \"stations\": \"\"\n           },\n           ...\n       ]\n     },\n   ...\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidSearchType",
            "description": "<p>Search type is missing from the query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingLocation",
            "description": "<p>City or state missing from query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoJobDate",
            "description": "<p>No max job age was found on db for this user.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoJobTypes",
            "description": "<p>No job types were found on db for this user.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"MissingLocation\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/jobs.js",
    "groupTitle": "Jobs"
  },
  {
    "type": "get",
    "url": "/thingstodo",
    "title": "Things To Do Search",
    "name": "ThingsToDoSearch",
    "group": "ThingsToDo",
    "description": "<p>Get list of things to do by coordinates or city/state.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/thingstodo?city=San+Diego&state=CA&radius=5\npath-to-topia-api.com/lat=33.218390&long=-111.767775&radius=5",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lat",
            "description": "<p>Latitude. Required when city/state are not provided</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "long",
            "description": "<p>Longitude. Required when city/state are not provided.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City to search. Required when lat/long are not provided.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state to search. Required when lat/long are not provided.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "radius",
            "defaultValue": "25",
            "description": "<p>Radius in miles to search for things to do.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for fish tacos:",
          "content": "\n {\n \"businesses\": [\n {\n     \"id\": \"oscars-mexican-seafood-san-diego-6\",\n     \"name\": \"Oscar's Mexican Seafood\",\n     \"image_url\": \"https://s3-media3.fl.yelpcdn.com/bphoto/YT2brlhILpPZgIlxJEZ9SA/o.jpg\",\n     \"is_closed\": false,\n     \"url\": \"https://www.yelp.com/biz/oscars-mexican-seafood-san-diego-6?adjust_creative=z4rq50TEkyGgxdcoaC1u2g&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=z4rq50TEkyGgxdcoaC1u2g\",\n     \"review_count\": 1247,\n     \"categories\": [\n         {\n             \"alias\": \"seafood\",\n             \"title\": \"Seafood\"\n         },\n         {\n             \"alias\": \"mexican\",\n             \"title\": \"Mexican\"\n         }\n     ],\n     \"rating\": 4,\n     \"coordinates\": {\n         \"latitude\": 32.7486014556313,\n         \"longitude\": -117.15913947605\n     },\n     \"transactions\": [\n         \"delivery\",\n         \"pickup\"\n     ],\n     \"price\": \"$\",\n     \"location\": {\n         \"address1\": \"646 University Ave\",\n         \"address2\": \"\",\n         \"address3\": \"\",\n         \"city\": \"San Diego\",\n         \"zip_code\": \"92103\",\n         \"country\": \"US\",\n         \"state\": \"CA\",\n         \"display_address\": [\n             \"646 University Ave\",\n             \"San Diego, CA 92103\"\n         ]\n     },\n     \"phone\": \"+16197983550\",\n     \"display_phone\": \"(619) 798-3550\",\n     \"distance\": 4690.501461512596\n },\n ...\n ],\n \"total\": 332\n \"terms\": [\n       \"fish tacos\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SearchLocationMissing",
            "description": "<p>lat/long or city/state missing from query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidSearchType",
            "description": "<p>Internal error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"MissingCoordinates\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/thingsToDo.js",
    "groupTitle": "ThingsToDo"
  },
  {
    "type": "post",
    "url": "/users/profile",
    "title": "Modify Profile",
    "name": "Modify",
    "group": "Users",
    "description": "<p>Modify preference(s) on users profile.</p> <p>TYPES:</p> <p>Single: Make a change to a single profile value.</p> <p>Multiple: Send a JSON representation of all the values to be overwritten in the profile.</p> <p>MODES:</p> <p>modify: Modifies an existing non-list value.</p> <p>remove: Removes a key/value pair. If used on an list, the entire list is removed.</p> <p>listappend: Appends a value to an existing list.</p> <p>listremove: Removes a value from an existing list.</p> <p>PROFILE ITEMS:</p> <p>email: String</p> <p>prefs_jobs_postedDate: Number</p> <p>prefs_jobs_saved: String[]</p> <p>prefs_jobs_titles: String[]</p> <p>prefs_jobs_types: String[]{&quot;fulltime&quot;, &quot;parttime&quot;, &quot;contract&quot;, &quot;internship&quot;, &quot;temporary&quot;}</p> <p>prefs_house_beds: Number</p> <p>prefs_house_baths: Number</p> <p>prefs_house_purchaseType: String[]{&quot;rent&quot;, &quot;buy&quot;}</p> <p>prefs_life_titles: String[]</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/users/profile",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"single\"",
              "\"multiple\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Type of profile change to make.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"modify\"",
              "\"remove\"",
              "\"listappend\"",
              "\"listremove\""
            ],
            "optional": false,
            "field": "mode",
            "description": "<p>Specify what operation to run. Req with type of single.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>Key to add to users job preferences.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Value to assign to the key. (Required for modes: modify, listappend, listremove). Req with type of single.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "prefs",
            "description": "<p>Object to overwrite user preferences. Req with type of multiple.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Single Example:",
          "content": "{\n  \"key\": \"prefs_jobs_types\",\n  \"value\": \"fulltime\",\n  \"mode\": \"listappend\",\n  \"type\": \"single\"\n}",
          "type": "json"
        },
        {
          "title": "Multiple Example:",
          "content": "{\n   \"prefs\": {\n        \"prefs_jobs_titles\": [\"Software Engineer\", \"Developer\", \"Java\"],\n        \"prefs_jobs_postedDate\": 60\n   },\n   \"type\":\"multiple\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidModifyType",
            "description": "<p>Modify type is missing from the query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>User information is not in the database.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidKey",
            "description": "<p>Invalid key given, either missing from body or not found on the database.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidMode",
            "description": "<p>Invalid mode given.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ElemNotFound",
            "description": "<p>Element not found in list.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingValue",
            "description": "<p>No value given.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ModeError",
            "description": "<p>Internal error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": {\n     \"type\": \"UserNotFound\",\n     \"msg\": \"Explanation of failure.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/profile",
    "title": "Get Profile",
    "name": "Profile",
    "group": "Users",
    "description": "<p>Get users profile from database.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/users/profile\npath-to-topia-api.com/users/profile?cityarray=true",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "cityarray",
            "defaultValue": "false",
            "description": "<p>Optional - Return city match results as a sorted array by match percentage.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"cityarray\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n    \"prefs_jobs_postedDate\": 30,\n    \"last_updated\": 1508121556207,\n    \"prefs_jobs_titles\": [\n        \"software\"\n    ],\n    \"cityMatch\": {\n        \"Phoenix\": {\n            \"city\": \"Phoenix\",\n            \"state\": \"Arizona\",\n            \"rating\": 16,\n            \"ranking\": 21\n        },\n        \"Tucson\": {\n            \"city\": \"Tucson\",\n            \"state\": \"Arizona\",\n            \"rating\": 14.4,\n            \"ranking\": 22\n        },\n        \"Fresno\": {\n            \"city\": \"Fresno\",\n            \"state\": \"California\",\n            \"rating\": 4.4,\n            \"ranking\": 33\n        },\n        \"Los Angeles\": {\n            \"city\": \"Los Angeles\",\n            \"state\": \"California\",\n            \"rating\": 6.5,\n            \"ranking\": 32\n        },\n        \"San Diego\": {\n            \"city\": \"San Diego\",\n            \"state\": \"California\",\n            \"rating\": 26.4,\n            \"ranking\": 11\n        },\n        \"San Francisco\": {\n            \"city\": \"San Francisco\",\n            \"state\": \"California\",\n            \"rating\": 100,\n            \"ranking\": 1\n        },\n        \"San Jose\": {\n            \"city\": \"San Jose\",\n            \"state\": \"California\",\n            \"rating\": 26,\n            \"ranking\": 12\n        },\n        \"Denver\": {\n            \"city\": \"Denver\",\n            \"state\": \"Colorado\",\n            \"rating\": 50.2,\n            \"ranking\": 6\n        },\n        \"Washington\": {\n            \"city\": \"Washington\",\n            \"state\": \"District of Columbia\",\n            \"rating\": 85,\n            \"ranking\": 2\n        },\n        \"Jacksonville\": {\n            \"city\": \"Jacksonville\",\n            \"state\": \"Florida\",\n            \"rating\": 16.3,\n            \"ranking\": 20\n        },\n        \"Chicago\": {\n            \"city\": \"Chicago\",\n            \"state\": \"Illinois\",\n            \"rating\": 23.6,\n            \"ranking\": 14\n        },\n        \"Indianapolis\": {\n            \"city\": \"Indianapolis\",\n            \"state\": \"Indiana\",\n            \"rating\": 21.7,\n            \"ranking\": 17\n        },\n        \"Louisville\": {\n            \"city\": \"Louisville\",\n            \"state\": \"Kentucky\",\n            \"rating\": 14.2,\n            \"ranking\": 23\n        },\n        \"Baltimore\": {\n            \"city\": \"Baltimore\",\n            \"state\": \"Maryland\",\n            \"rating\": 27.7,\n            \"ranking\": 10\n        },\n        \"Boston\": {\n            \"city\": \"Boston\",\n            \"state\": \"Massachusetts\",\n            \"rating\": 78,\n            \"ranking\": 3\n        },\n        \"Detroit\": {\n            \"city\": \"Detroit\",\n            \"state\": \"Michigan\",\n            \"rating\": 12.9,\n            \"ranking\": 25\n        },\n        \"Las Vegas\": {\n            \"city\": \"Las Vegas\",\n            \"state\": \"Nevada\",\n            \"rating\": 24.6,\n            \"ranking\": 13\n        },\n        \"Albuquerque\": {\n            \"city\": \"Albuquerque\",\n            \"state\": \"New Mexico\",\n            \"rating\": 12.4,\n            \"ranking\": 27\n        },\n        \"New York\": {\n            \"city\": \"New York\",\n            \"state\": \"New York\",\n            \"rating\": 8.9,\n            \"ranking\": 31\n        },\n        \"Charlotte\": {\n            \"city\": \"Charlotte\",\n            \"state\": \"North Carolina\",\n            \"rating\": 30.7,\n            \"ranking\": 8\n        },\n        \"Columbus\": {\n            \"city\": \"Columbus\",\n            \"state\": \"Ohio\",\n            \"rating\": 22.7,\n            \"ranking\": 15\n        },\n        \"Oklahoma City\": {\n            \"city\": \"Oklahoma City\",\n            \"state\": \"Oklahoma\",\n            \"rating\": 12,\n            \"ranking\": 28\n        },\n        \"Portland\": {\n            \"city\": \"Portland\",\n            \"state\": \"Oregon\",\n            \"rating\": 36.2,\n            \"ranking\": 7\n        },\n        \"Philadelphia\": {\n            \"city\": \"Philadelphia\",\n            \"state\": \"Pennsylvania\",\n            \"rating\": 13.8,\n            \"ranking\": 24\n        },\n        \"Memphis\": {\n            \"city\": \"Memphis\",\n            \"state\": \"Tennessee\",\n            \"rating\": 9.9,\n            \"ranking\": 30\n        },\n        \"Nashville\": {\n            \"city\": \"Nashville\",\n            \"state\": \"Tennessee\",\n            \"rating\": 22.1,\n            \"ranking\": 16\n        },\n        \"Austin\": {\n            \"city\": \"Austin\",\n            \"state\": \"Texas\",\n            \"rating\": 56.5,\n            \"ranking\": 5\n        },\n        \"Dallas\": {\n            \"city\": \"Dallas\",\n            \"state\": \"Texas\",\n            \"rating\": 30,\n            \"ranking\": 9\n        },\n        \"El Paso\": {\n            \"city\": \"El Paso\",\n            \"state\": \"Texas\",\n            \"rating\": 0,\n            \"ranking\": 34\n        },\n        \"Fort Worth\": {\n            \"city\": \"Fort Worth\",\n            \"state\": \"Texas\",\n            \"rating\": 10.5,\n            \"ranking\": 29\n        },\n        \"Houston\": {\n            \"city\": \"Houston\",\n            \"state\": \"Texas\",\n            \"rating\": 19.7,\n            \"ranking\": 18\n        },\n        \"San Antonio\": {\n            \"city\": \"San Antonio\",\n            \"state\": \"Texas\",\n            \"rating\": 12.7,\n            \"ranking\": 26\n        },\n        \"Seattle\": {\n            \"city\": \"Seattle\",\n            \"state\": \"Washington\",\n            \"rating\": 77.9,\n            \"ranking\": 4\n        },\n        \"Milwaukee\": {\n            \"city\": \"Milwaukee\",\n            \"state\": \"Wisconsin\",\n            \"rating\": 16.9,\n            \"ranking\": 19\n        }\n    },\n    \"prefs_jobs_saved\": [\n        {\n            \"jobtitle\": \"Java Software Developer\",\n            \"company\": \"Charles Schwab\",\n            \"city\": \"Phoenix\",\n            \"state\": \"AZ\",\n            \"country\": \"US\",\n            \"language\": \"en\",\n            \"formattedLocation\": \"Phoenix, AZ\",\n            \"source\": \"Charles Schwab\",\n            \"date\": \"Wed, 22 Nov 2017 11:16:08 GMT\",\n            \"snippet\": \"Provide creative technical solutions to new business requirements and partner with the business owners to implement the solution. We believe that , when done right, investing liberates people to create their own destiny. We take our responsibility to support, teach and develop our team very seriously, and we expect you to be driven to learn and grow and continuously contribute to evolving the...\",\n            \"url\": \"http://www.indeed.com/rc/clk?jk=171ee9e4dd78a457&atk=\",\n            \"onmousedown\": \"indeed_clk(this,'');\",\n            \"latitude\": 33.45055,\n            \"longitude\": -112.06593,\n            \"jobkey\": \"171ee9e4dd78a457\",\n            \"sponsored\": false,\n            \"expired\": true,\n            \"indeedApply\": false,\n            \"formattedLocationFull\": \"Phoenix, AZ 85002\",\n            \"formattedRelativeTime\": \"30+ days ago\",\n            \"stations\": \"\",\n            \"recommendations\": []\n        },\n        {\n            \"jobtitle\": \"Software Engineer, University Graduate\",\n            \"company\": \"Google\",\n            \"city\": \"Seattle\",\n            \"state\": \"WA\",\n            \"country\": \"US\",\n            \"language\": \"en\",\n            \"formattedLocation\": \"Seattle, WA\",\n            \"source\": \"Google\",\n            \"date\": \"Wed, 22 Nov 2017 13:08:55 GMT\",\n            \"snippet\": \"BA/BS degree in Computer Science or related technical field, or equivalent practical experience. As a software engineer in the Engineering Productivity organization, you'll use your software design, analysis and programming skills to create innovative automated test systems. Whether it's finding new and innovative ways to advance search quality, building computing platform and networking...\",\n            \"url\": \"http://www.indeed.com/rc/clk?jk=455ba8b70208e25b&atk=\",\n            \"onmousedown\": \"indeed_clk(this,'');\",\n            \"latitude\": 47.604397,\n            \"longitude\": -122.32967,\n            \"jobkey\": \"455ba8b70208e25b\",\n            \"sponsored\": false,\n            \"expired\": false,\n            \"indeedApply\": false,\n            \"formattedLocationFull\": \"Seattle, WA\",\n            \"formattedRelativeTime\": \"8 days ago\",\n            \"stations\": \"\",\n            \"recommendations\": []\n        }\n    ],\n    \"prefs_house_beds\": 4,\n    \"prefs_house_saved\": [\n        {\n            \"zip\": 77018,\n            \"Address\": \"0 Del Norte DriveHouston\",\n            \"fullBaths\": 0,\n            \"geoJson\": {\n                \"type\": \"POINT\",\n                \"coordinates\": [\n                    -95.6476462,\n                    29.7056313\n                ]\n            },\n            \"hashKey\": -87,\n            \"purchaseType\": \"buy\",\n            \"halfBaths\": 0,\n            \"details_Description\": \"Small lot , road will be paved in future , good for investors or someone needing extra space for equipment or large items.\",\n            \"state\": \"TX\",\n            \"beds\": 0,\n            \"city\": \"Houston\",\n            \"photoLink\": \"http://img4.homefinder.com/_img_/314480392/1f498f946bd3c5bf09c888defdb21a48bafd9282/200\",\n            \"details_PhotoLinks\": [\n                \"http://img1.homefinder.com/_img_/314480392/7e9aebe974b4d8f88021cdff302cbeb5facc093d/592-\",\n                \"http://img2.homefinder.com/_img_/314480392/1f498f946bd3c5bf09c888defdb21a48bafd9282/592-\",\n                \"http://img3.homefinder.com/_img_/314480392/0014bd94a13ee69ddc6303054b9a6832e5a5cce6/592-\",\n                \"http://img3.homefinder.com/_img_/314480392/248326dfd162e66e5b1881f6f3bd15147081ef2c/592-\",\n                \"http://img3.homefinder.com/_img_/314480392/afe2be477ca522d3efc1bca70c6f47256cec2f5b/592-\",\n                \"http://img5.homefinder.com/_img_/314480392/a2e73746f9fa33b115da0240ac0ede40b8a441af/592-\",\n                \"http://img5.homefinder.com/_img_/314480392/b943cf06f615db93168c3554f1dde3f19b3c7d25/592-\",\n                \"http://img5.homefinder.com/_img_/314480392/caeca3f0e04dd8d5e44b221d685e5314c47a6597/592-\"\n            ],\n            \"rangeKey\": \"0 Del Norte DriveHouston\",\n            \"geohash\": -8772767465978812000,\n            \"detailsLink\": \"http://www.homefinder.com/TX/Houston/0-Del-Norte-Drive-314480392d\",\n            \"price\": 29800,\n            \"lat\": 29.7056313,\n            \"long\": -95.6476462,\n            \"street\": \"0 Del Norte Drive\"\n        }\n    ],\n    \"email\": \"testEmail@email.com\",\n    \"prefs_things_saved\": [\n        {\n            \"id\": \"oscars-mexican-seafood-san-diego-6\",\n            \"name\": \"Oscar's Mexican Seafood\",\n            \"image_url\": \"https://s3-media3.fl.yelpcdn.com/bphoto/YT2brlhILpPZgIlxJEZ9SA/o.jpg\",\n            \"is_claimed\": false,\n            \"is_closed\": false,\n            \"url\": \"https://www.yelp.com/biz/oscars-mexican-seafood-san-diego-6?adjust_creative=z4rq50TEkyGgxdcoaC1u2g&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=z4rq50TEkyGgxdcoaC1u2g\",\n            \"phone\": \"+16197983550\",\n            \"display_phone\": \"(619) 798-3550\",\n            \"review_count\": 1256,\n            \"categories\": [\n                {\n                    \"alias\": \"seafood\",\n                    \"title\": \"Seafood\"\n                },\n                {\n                    \"alias\": \"mexican\",\n                    \"title\": \"Mexican\"\n                }\n            ],\n            \"rating\": 4,\n            \"location\": {\n                \"address1\": \"646 University Ave\",\n                \"address2\": \"\",\n                \"address3\": \"\",\n                \"city\": \"San Diego\",\n                \"zip_code\": \"92103\",\n                \"country\": \"US\",\n                \"state\": \"CA\",\n                \"display_address\": [\n                    \"646 University Ave\",\n                    \"San Diego, CA 92103\"\n                ],\n                \"cross_streets\": \"7th Ave & 6th Ave\"\n            },\n            \"coordinates\": {\n                \"latitude\": 32.7486014556313,\n                \"longitude\": -117.15913947605\n            },\n            \"photos\": [\n                \"https://s3-media3.fl.yelpcdn.com/bphoto/YT2brlhILpPZgIlxJEZ9SA/o.jpg\",\n                \"https://s3-media4.fl.yelpcdn.com/bphoto/fN791SLP3LI3OfZBXxTE-w/o.jpg\",\n                \"https://s3-media4.fl.yelpcdn.com/bphoto/arNtfTJzLE2Gvril_b9BMQ/o.jpg\"\n            ],\n            \"price\": \"$\",\n            \"hours\": [\n                {\n                    \"open\": [\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2100\",\n                            \"day\": 0\n                        },\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2100\",\n                            \"day\": 1\n                        },\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2100\",\n                            \"day\": 2\n                        },\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2100\",\n                            \"day\": 3\n                        },\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2200\",\n                            \"day\": 4\n                        },\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2200\",\n                            \"day\": 5\n                        },\n                        {\n                            \"is_overnight\": false,\n                            \"start\": \"0800\",\n                            \"end\": \"2100\",\n                            \"day\": 6\n                        }\n                    ],\n                    \"hours_type\": \"REGULAR\",\n                    \"is_open_now\": true\n                }\n            ],\n            \"transactions\": [\n                \"delivery\",\n                \"pickup\"\n            ]\n        }\n    ],\n    \"prefs_house_baths\": 3,\n    \"username\": \"dev\",\n    \"prefs_house_purchaseType\": [\n        \"buy\",\n        \"rent\"\n    ],\n    \"prefs_jobs_types\": [\n        \"fulltime\"\n    ],\n    \"prefs_things_titles\": [\n        \"parks\",\n        \"thai\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>User information is not in the database.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": {\n     \"type\": \"UserNotFound\",\n     \"msg\": \"Explanation of failure.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/profile/houses",
    "title": "Save or Remove Houses",
    "name": "SaveHouse",
    "group": "Users",
    "description": "<p>Add/remove a saved house to/from the users profile.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/users/profile/houses",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rangekey",
            "description": "<p>House range key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"add\"",
              "\"remove\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Operation to add or remove a house to/from the users profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example:",
          "content": "{\n  \"rangeKey\": \"0 Del Norte DriveHouston\",\n  \"operation\": \"add\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidSaveType",
            "description": "<p>Save operation type is missing from the query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "HouseAlreadySaved",
            "description": "<p>House is already saved on the users profile.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingRangeKey",
            "description": "<p>rangeKey not found in query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoResultsFound",
            "description": "<p>No house found with the given range key.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": {\n     \"type\": \"TokenNotFound\",\n     \"msg\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/profile/jobs",
    "title": "Save or Remove Jobs",
    "name": "SaveJob",
    "group": "Users",
    "description": "<p>Add/remove a saved job to/from the users profile.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/users/profile/jobs",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobkey",
            "description": "<p>Indeed job key.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"add\"",
              "\"remove\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Operation to add or remove a job to/from the users profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example:",
          "content": "{\n  \"jobkey\": \"53091387dd962a7d\",\n  \"operation\": \"add\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidSaveType",
            "description": "<p>Save operation type is missing from the query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ItemAlreadySaved",
            "description": "<p>Job is already saved on the users profile.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JobNotFound",
            "description": "<p>Job not found from job source.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoJobsKeysFound",
            "description": "<p>jobkey not found in query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoJobsFound",
            "description": "<p>No jobs found with the given key(s).</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": {\n     \"type\": \"TokenNotFound\",\n     \"msg\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/profile/things",
    "title": "Save or Remove Things",
    "name": "SaveThing",
    "group": "Users",
    "description": "<p>Add/remove a saved thing to do to/from the users profile.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/users/profile/things",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Business id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"add\"",
              "\"remove\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Operation to add or remove a thing to/from the users profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example:",
          "content": "{\n  \"id\": \"oscars-mexican-seafood-san-diego-6\",\n  \"operation\": \"add\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidSaveType",
            "description": "<p>Save operation type is missing from the query.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ItemAlreadySaved",
            "description": "<p>Item is already saved on the users profile.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidTable",
            "description": "<p>Internal error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenNotFound",
            "description": "<p>Bearer token not found in header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenMismatch",
            "description": "<p>Bearer token does not match.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TokenExpired",
            "description": "<p>Bearer token is expired.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": {\n     \"type\": \"TokenNotFound\",\n     \"msg\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/profile/ratings",
    "title": "Update Ratings",
    "name": "UpdateRatings",
    "group": "Users",
    "description": "<p>Allows front-end to update city match ratings for the current user.</p> <p>Note: Update is not immediate.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n    authorization: Bearer QZ3jhbfdof84GFBlSe\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example-Request(s)",
        "content": "path-to-topia-api.com/users/profile/ratings",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CityMatchFailed",
            "description": "<p>Internal error. See console logs.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": {\n     \"type\": \"TokenNotFound\",\n     \"msg\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./apiDocs/main.js",
    "group": "_home_doni_School_SER593_topia_SER593_BackendServer_apiDocs_main_js",
    "groupTitle": "_home_doni_School_SER593_topia_SER593_BackendServer_apiDocs_main_js",
    "name": ""
  }
] });

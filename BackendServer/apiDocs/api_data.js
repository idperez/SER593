define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login",
    "name": "Login",
    "group": "Authentication",
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
      }
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": ""
          }
        ]
      }
    },
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
      }
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
    "url": "/search/jobs/companyinfo",
    "title": "CompanyInfo",
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
    "url": "/search/jobs/bykey",
    "title": "JobByKey",
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
          "content": "\n{\n  \"jobtitle\": \"Graduate SubSystems Engineer\",\n  \"company\": \"ARM\",\n  \"city\": \"Austin\",\n  \"state\": \"TX\",\n  \"country\": \"US\",\n  \"language\": \"en\",\n  \"formattedLocation\": \"Austin, TX\",\n  \"source\": \"ARM\",\n  \"date\": \"Wed, 20 Sep 2017 02:04:17 GMT\",\n  \"snippet\": \"Bachelors or Masters degree in Electrical/Computer Engineering or Computer Science with a 3.5+ GPA. Be motivated to continuously develop skills and accept a variety of responsibilities as part of contributing to the design center’s success. We employ leading-edge modeling, design and verification technologies to design low-power high-performance products....\",\n  \"url\": \"http://www.indeed.com/rc/clk?jk=455ba8b70208e25b&atk=\",\n  \"onmousedown\": \"indeed_clk(this,'');\",\n  \"latitude\": 30.266483,\n  \"longitude\": -97.74176,\n  \"jobkey\": \"455ba8b70208e25b\",\n  \"sponsored\": false,\n  \"expired\": false,\n  \"indeedApply\": false,\n  \"formattedLocationFull\": \"Austin, TX\",\n  \"formattedRelativeTime\": \"10 days ago\",\n  \"stations\": \"\",\n  \"recommendations\": []\n},",
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
            "description": "<p>jobkey not found in query.</p>"
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
    "url": "/search/jobs/coords",
    "title": "JobsByCoordinates",
    "name": "JobsByCoordinates",
    "group": "Jobs",
    "description": "<p>Get jobs by supplied coordinates and user preferences.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User profile to get job information from.</p>"
          },
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
            "optional": false,
            "field": "limit",
            "description": "<p>Max number of results.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "radius",
            "description": "<p>Radius in miles (Optional: default is 25).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n  {\n    \"jobtitle\": \"Senior Software Developer\",\n    \"company\": \"IBM\",\n    \"city\": \"Austin\",\n    \"state\": \"TX\",\n    \"country\": \"US\",\n    \"language\": \"en\",\n    \"formattedLocation\": \"Austin, TX\",\n    \"source\": \"IBM\",\n    \"date\": \"Fri, 08 Sep 2017 03:01:34 GMT\",\n    \"snippet\": \"We are looking for <b>Software</b> Developers to join our Cloud Innovation Lab team in Austin, TX . With industry leadership in analytics, security, commerce, and...\",\n    \"url\": \"http://www.indeed.com/viewjob?jk=2fb6f6598eb121bb&qd=AHBv2aSOJz5QeLJ8HScbwBYPiZNGjz23m_pprWrYM6_QIqvTB8w9VPZxJV3B6V4zrh6KYLpBfM79FCbByGe97Rkt9i6ApQ8v0up_BH1c3Wcep6I5-twM7jC8td-9rGTG&indpubnum=7658403343281086&atk=1bra0uipja39cfrp\",\n    \"onmousedown\": \"indeed_clk(this,'5681');\",\n    \"latitude\": 30.266483,\n    \"longitude\": -97.74176,\n    \"jobkey\": \"2fb6f6598eb121bb\",\n    \"sponsored\": false,\n    \"expired\": false,\n    \"indeedApply\": false,\n    \"formattedLocationFull\": \"Austin, TX\",\n    \"formattedRelativeTime\": \"22 days ago\",\n    \"stations\": \"\"\n   },\n   ...\n]",
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
            "field": "NoResultsFound",
            "description": "<p>No results were returned.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingLocation",
            "description": "<p>lat/long missing from query.</p>"
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
          "content": "{\n  \"err\": \"MissingLocation\",\n  \"msg\": \"\"\n}",
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
    "url": "/search/jobs/location",
    "title": "JobsByLocation",
    "name": "JobsByLocation",
    "group": "Jobs",
    "description": "<p>Get jobs by supplied city and state and user preferences.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User profile to get job information from.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City to search.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>State to search. (2 letter abbreviation)</p>"
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
            "optional": false,
            "field": "radius",
            "description": "<p>from city center to get results (Optional: default is 25).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n  {\n    \"jobtitle\": \"Senior Software Developer\",\n    \"company\": \"IBM\",\n    \"city\": \"Austin\",\n    \"state\": \"TX\",\n    \"country\": \"US\",\n    \"language\": \"en\",\n    \"formattedLocation\": \"Austin, TX\",\n    \"source\": \"IBM\",\n    \"date\": \"Fri, 08 Sep 2017 03:01:34 GMT\",\n    \"snippet\": \"We are looking for <b>Software</b> Developers to join our Cloud Innovation Lab team in Austin, TX . With industry leadership in analytics, security, commerce, and...\",\n    \"url\": \"http://www.indeed.com/viewjob?jk=2fb6f6598eb121bb&qd=AHBv2aSOJz5QeLJ8HScbwBYPiZNGjz23m_pprWrYM6_QIqvTB8w9VPZxJV3B6V4zrh6KYLpBfM79FCbByGe97Rkt9i6ApQ8v0up_BH1c3Wcep6I5-twM7jC8td-9rGTG&indpubnum=7658403343281086&atk=1bra0uipja39cfrp\",\n    \"onmousedown\": \"indeed_clk(this,'5681');\",\n    \"latitude\": 30.266483,\n    \"longitude\": -97.74176,\n    \"jobkey\": \"2fb6f6598eb121bb\",\n    \"sponsored\": false,\n    \"expired\": false,\n    \"indeedApply\": false,\n    \"formattedLocationFull\": \"Austin, TX\",\n    \"formattedRelativeTime\": \"22 days ago\",\n    \"stations\": \"\"\n   },\n   ...\n]",
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
    "url": "/search/jobs/zip",
    "title": "JobsByZip",
    "name": "JobsByZip",
    "group": "Jobs",
    "description": "<p>Get jobs by supplied zip code and user preferences.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User profile to get job information from.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zip",
            "description": "<p>Zip code.</p>"
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
            "optional": false,
            "field": "radius",
            "description": "<p>Radius in miles (Optional: default is 25).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n  {\n    \"jobtitle\": \"Senior Software Developer\",\n    \"company\": \"IBM\",\n    \"city\": \"Austin\",\n    \"state\": \"TX\",\n    \"country\": \"US\",\n    \"language\": \"en\",\n    \"formattedLocation\": \"Austin, TX\",\n    \"source\": \"IBM\",\n    \"date\": \"Fri, 08 Sep 2017 03:01:34 GMT\",\n    \"snippet\": \"We are looking for <b>Software</b> Developers to join our Cloud Innovation Lab team in Austin, TX . With industry leadership in analytics, security, commerce, and...\",\n    \"url\": \"http://www.indeed.com/viewjob?jk=2fb6f6598eb121bb&qd=AHBv2aSOJz5QeLJ8HScbwBYPiZNGjz23m_pprWrYM6_QIqvTB8w9VPZxJV3B6V4zrh6KYLpBfM79FCbByGe97Rkt9i6ApQ8v0up_BH1c3Wcep6I5-twM7jC8td-9rGTG&indpubnum=7658403343281086&atk=1bra0uipja39cfrp\",\n    \"onmousedown\": \"indeed_clk(this,'5681');\",\n    \"latitude\": 30.266483,\n    \"longitude\": -97.74176,\n    \"jobkey\": \"2fb6f6598eb121bb\",\n    \"sponsored\": false,\n    \"expired\": false,\n    \"indeedApply\": false,\n    \"formattedLocationFull\": \"Austin, TX\",\n    \"formattedRelativeTime\": \"22 days ago\",\n    \"stations\": \"\"\n   },\n   ...\n]",
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
            "field": "MissingLocation",
            "description": "<p>zip code missing from query.</p>"
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
          "content": "{\n  \"err\": \"MissingLocation\",\n  \"msg\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/jobs.js",
    "groupTitle": "Jobs"
  },
  {
    "type": "post",
    "url": "/users/modify",
    "title": "Modify",
    "name": "Modify",
    "group": "Users",
    "description": "<p>Modify a preference on users profile.</p> <p>MODES:</p> <p>modify: Modifies an existing non-list value.</p> <p>remove: Removes a key/value pair. If used on an list, the entire list is removed.</p> <p>listappend: Appends a value to an existing list.</p> <p>listremove: Removes a value from an existing list.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users login username.</p>"
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
            "description": "<p>Value to assign to the key. (Required for modes: modify, listappend, listremove)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mode",
            "description": "<p>Specify what operation to run. Options: modify, remove, listappend, listremove</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"username\": \"bob\",\n  \"key\": \"prefs_jobs_types\",\n  \"value\": \"fulltime\",\n  \"mode\": \"listappend\"\n}",
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
            "field": "InvalidKey",
            "description": "<p>Invalid key given.</p>"
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
    "filename": "./routes/profiles.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/modifymulti",
    "title": "Modify Multiple",
    "name": "ModifyMultiple",
    "group": "Users",
    "description": "<p>Modify multiple preferences on users profile.</p> <p>This allows passing in an object containing some keys from a users profile. All keys within the object will overwrite the matching profile key on the database.</p> <p>To remove a key from the database, include it in the object and set it's value to null.</p> <p>NOTE: Entire arrays must be included with this method, as whatever is on the database will be overwritten. See /modify to append or remove from an array value.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users login username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "prefs",
            "description": "<p>Object to overwrite user preferences.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"username\": \"dev\",\n    \"prefs\": {\n       \"prefs_jobs_titles\": [\"Software Engineer\", \"Developer\", \"Java\"],\n        \"prefs_jobs_postedDate\": 60\n    }\n}",
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
            "field": "InvalidKey",
            "description": "<p>Invalid key given.</p>"
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
    "filename": "./routes/profiles.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/profile",
    "title": "Profile",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users login username.</p>"
          }
        ]
      }
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
    "filename": "./routes/profiles.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/removejob",
    "title": "RemoveJob",
    "name": "RemoveJob",
    "group": "Users",
    "description": "<p>Remove a saved job from the users profile.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users login username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobkey",
            "description": "<p>Indeed job key.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SavedJobNotFound",
            "description": "<p>Job is not saved on users profile.</p>"
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
    "filename": "./routes/profiles.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/savejob",
    "title": "SaveJob",
    "name": "SaveJob",
    "group": "Users",
    "description": "<p>Add a saved job to the users profile.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users login username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobkey",
            "description": "<p>Indeed job key.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JobAlreadySaved",
            "description": "<p>Job is already saved on the users profile.</p>"
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
    "filename": "./routes/profiles.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/updateratings",
    "title": "UpdateRatings",
    "name": "UpdateRatings",
    "group": "Users",
    "description": "<p>Allows front-end to update city match ratings.</p>",
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users login username.</p>"
          }
        ]
      }
    },
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
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCitiesInObject",
            "description": "<p>Internal error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "RatioError",
            "description": "<p>Internal error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingCityData",
            "description": "<p>Internal error.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorSettingRatio",
            "description": "<p>Internal error.</p>"
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
    "filename": "./routes/profiles.js",
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

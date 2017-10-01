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
            "field": "InvalidLogin",
            "description": "<p>Username or password were incorrect.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"InvalidLogin\",\n  \"msg\": \"\"\n}",
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
    "url": "/auth/logout/",
    "title": "Logout",
    "name": "Logout",
    "group": "Authentication",
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
    "version": "0.0.0",
    "filename": "./routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/search/jobs/coords",
    "title": "JobsByCoordinates",
    "name": "JobsByCoordinates",
    "group": "Jobs",
    "description": "<p>Get jobs by supplied coordinates and user preferences.</p>",
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
            "description": "<p>Radius in miles.</p>"
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
    "url": "/search/jobs/bykey",
    "title": "JobsByKey",
    "name": "JobsByKey",
    "group": "Jobs",
    "description": "<p>Get job(s) by key</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobkeys",
            "description": "<p>Comma separated list of job keys</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n     {\n       \"jobtitle\": \"Graduate SubSystems Engineer\",\n       \"company\": \"ARM\",\n       \"city\": \"Austin\",\n       \"state\": \"TX\",\n       \"country\": \"US\",\n       \"language\": \"en\",\n       \"formattedLocation\": \"Austin, TX\",\n       \"source\": \"ARM\",\n       \"date\": \"Wed, 20 Sep 2017 02:04:17 GMT\",\n       \"snippet\": \"Bachelors or Masters degree in Electrical/Computer Engineering or Computer Science with a 3.5+ GPA. Be motivated to continuously develop skills and accept a variety of responsibilities as part of contributing to the design center’s success. We employ leading-edge modeling, design and verification technologies to design low-power high-performance products....\",\n       \"url\": \"http://www.indeed.com/rc/clk?jk=455ba8b70208e25b&atk=\",\n       \"onmousedown\": \"indeed_clk(this,'');\",\n       \"latitude\": 30.266483,\n       \"longitude\": -97.74176,\n       \"jobkey\": \"455ba8b70208e25b\",\n       \"sponsored\": false,\n       \"expired\": false,\n       \"indeedApply\": false,\n       \"formattedLocationFull\": \"Austin, TX\",\n       \"formattedRelativeTime\": \"10 days ago\",\n       \"stations\": \"\",\n       \"recommendations\": []\n     },\n     ...\n]",
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
            "description": "<p>lat/long missing from query.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"err\": \"NoJobsKeysFound\",\n  \"msg\": \"\"\n}",
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
            "description": "<p>from city center to get results.</p>"
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
            "description": "<p>Radius in miles.</p>"
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
    "url": "/profile/addjobpref",
    "title": "AddJobPref",
    "name": "AddJobPref",
    "group": "Users",
    "description": "<p>Add or update job preference on users profile.</p>",
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
            "description": "<p>Value to assign to the key.</p>"
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
    "url": "/profile",
    "title": "Profile",
    "name": "Profile",
    "group": "Users",
    "description": "<p>Get users profile from database.</p>",
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

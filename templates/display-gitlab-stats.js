var xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://gitlab.com/api/v4/projects/59294372/repository/commits");

var usernames = ['aroramihir09', 'johnalex1021', 'joshuadierker', 'mabelegbirika', 'stoven2k17'];
var modelnames = ['abody1', 'abody2', 'abody3', 'abody4', 'abody5'];
var curresponse;

// get team commit info
var response;
$.ajax({   
    async: true,
    crossDomain: true,
    url: 'https://gitlab.com/api/v4/projects/59294372/repository/commits',
    method: "GET",
    headers: {
        "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U"
    },                                         
    async:false,                    
    success: function(data)          
    {   
       response = data;
    },
   });

bodyElement = document.getElementById("team-stats");
listElement = document.createElement("li");
listElement.innerHTML = "<strong> No. of Commits:</strong> " + response.length;
bodyElement.appendChild(listElement);

// get team issue info
var response;
$.ajax({   
    async: true,
    crossDomain: true,
    url: 'https://gitlab.com/api/v4/projects/59294372/issues_statistics',
    method: "GET",
    headers: {
        "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U"
    },                                         
    async:false,                    
    success: function(data)          
    {   
       response = data;
    },
   });

bodyElement = document.getElementById("team-stats");
listElement = document.createElement("li");
listElement.innerHTML = "<strong> No. of Issues:</strong> " + response.statistics.counts.all
bodyElement.appendChild(listElement);

unitTestElement = document.createElement("li");
unitTestElement.innerHTML = "<strong> Total No. of Unit Tests:</strong> 0"
bodyElement.appendChild(unitTestElement)

//get individual commit info
for (i = 0; i < usernames.length; i++) {
    var response;
    $.ajax({   
        async: true,
        crossDomain: true,
        url: 'https://gitlab.com/api/v4/projects/59294372/repository/commits?author=' + usernames[i],
        method: "GET",
        headers: {
            "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U"
        },                                         
        async:false,                    
        success: function(data)          
        {   
           response = data;
        },
       });
    
    bodyElement = document.getElementById(modelnames[i]);
    listElement = document.createElement("li");
    listElement.innerHTML = "<strong> No. of Commits:</strong> " + response.length;
    bodyElement.appendChild(listElement);
}

//get individual issue info
for (i = 0; i < usernames.length; i++) {
    var response;
    $.ajax({   
        async: true,
        crossDomain: true,
        url: 'https://gitlab.com/api/v4/projects/59294372/issues_statistics?author_username=' + usernames[i],
        method: "GET",
        headers: {
            "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U"
        },                                         
        async:false,                    
        success: function(data)          
        {   
           response = data;
        },
       });

        bodyElement = document.getElementById(modelnames[i]);
        listElement = document.createElement("li");
        listElement.innerHTML = "<strong> No. of Issues:</strong> " + response.statistics.counts.all;
        bodyElement.appendChild(listElement);

        unitTestElement = document.createElement("li");
        unitTestElement.innerHTML = "<strong> No. of Unit Tests:</strong> 0"
        bodyElement.appendChild(unitTestElement)
}
xhttp.send();

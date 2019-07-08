function compareProjects(project1, project2)
{
    if(project1.date < project2.date)
    {
        return 1;
    }
    else if(project1.date > project2.date)
    {
        return -1;
    }
    else
    {
        return 0;
    }
}


fetch("https://api.github.com/users/TarcanGul/repos", {
    headers : {
        "User-Agent" : "Tarcan Gul Website",
        'Accept': 'application/vnd.github.v3+json'
    }
})
.then(function(response){
    return response.json();
})
.then(function(myJson) {
    console.log("Repos recieved.");
    //document.querySelector(".grid-container-projects").innerHTML = "";
    var buildingString = "";
    var projects = [];
    var dates = [];
    for(let data of myJson)
    {
        var link = data.html_url;
        var name = data.name;
        console.log(name);
        var description = data.description;
        var project = {
            date : Date.parse(data.pushed_at),
            project : '<div class="grid-item-project"><a href="' + link + '" target="_blank"><div><section class="ProjectArea"><h3 class="repo-name">' + name + '</h3><h5 class="repo-desr">Description: ' + description + '</h5></section></div></a></div>'
        }
        projects.push(project)
        //buildingString = buildingString + '<div class="grid-item-project"><a href="$' + link + '" target="_blank"><div><section class="ProjectArea"><h3 class="repo-name">' + name + '</h3><h5 class="repo-desr">Description: ' + description + '</h5></section></div></a></div>'
    }
    projects.sort(compareProjects);
    for(var i = 0; i < projects.length; i++)
    {
        buildingString += projects[i].project;
    }
    console.log(buildingString);
    document.getElementById("project-field").innerHTML = buildingString;
})
/**
 * 
 * @param { {date: Date, project: Node} } project1 
 * @param { {date: Date, project: Node} } project2 
 * @returns 1 if project2 is modified after project1
 */

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

/**
 * 
 * @param {string} link The project link
 * @param {string} projectName The project name
 * @param {string} description The descripion of the project
 * @returns the DOM node 
 */
function constructProjectNode(link, projectName, description) {
    const project = document.createElement('div');
    project.className = 'grid-item-project';
    const projectLink = document.createElement('a');
    projectLink.href = link;

    const projectNameHolder = document.createElement('h3');
    projectNameHolder.innerText = projectName;

    const descriptionHolder = document.createElement('p');
    descriptionHolder.innerText = description;

    projectLink.appendChild(projectNameHolder);
    projectLink.appendChild(descriptionHolder);

    project.appendChild(projectLink);

    return project;
}


await fetch("https://api.github.com/users/TarcanGul/repos", {
    headers : {
        'Accept': 'application/vnd.github.v3+json'
    }
})
.then(function(response){
    return response.json();
})
.then(function(jsonResponse) {
    let projects = [];
    for(let data of jsonResponse)
    {
        const link = data.html_url;
        const name = data.name;
        const description = data.description;
        const project = {
            date : Date.parse(data.pushed_at),
            project: constructProjectNode(link, name, description)
        }
        projects.push(project)
    }
    projects.sort(compareProjects);
    const projectField = document.getElementById("project-field");
    if(projectField) {
        projects.forEach(projectNode => projectField.appendChild(projectNode.project));
        document.querySelector(".loading-area").remove();
    }
})
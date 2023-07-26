const username = 'AotherQ';

async function getTopProjects() {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`);
  const data = await response.json();
  return data;
}

async function showTopProjects() {
  const topProjects = await getTopProjects();
  const topProjectsList = document.getElementById('top-projects');

  topProjects.forEach(async (project) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = project.html_url;
    a.textContent = project.name;

    const details = document.createElement('div');
    details.classList.add('project-details');

    const starIcon = document.createElement('span');
    starIcon.classList.add('star-icon');
    starIcon.textContent = '★ ' + project.stargazers_count;

    const forkIcon = document.createElement('span');
    forkIcon.classList.add('fork-icon');
    forkIcon.textContent = 'Fork: ' + project.forks_count;

    const languages = document.createElement('div');
    languages.classList.add('languages');
    
    const languagesResponse = await fetch(project.languages_url);
    const languagesData = await languagesResponse.json();
    const languageKeys = Object.keys(languagesData);
    
    languageKeys.forEach((languageKey) => {
      const language = document.createElement('span');
      language.classList.add('language');
      language.textContent = languageKey;
      languages.appendChild(language);
    });

    details.appendChild(starIcon);
    details.appendChild(forkIcon);
    details.appendChild(languages);

    li.appendChild(a);
    li.appendChild(details);
    topProjectsList.appendChild(li);
  });
}

window.addEventListener('load', () => {
  showTopProjects();
});



function switch_open(){
  
  var checkbox = document.getElementsByClassName("check")[0];

  var slider = document.getElementsByClassName("slider")[0];

  var img_box = document.getElementsByClassName("back")[0];

  checkbox.toggleAttribute("checked");

  if( checkbox.hasAttribute("checked") ){
    document.body.classList.toggle("dark-theme");
  }
  else{
    document.body.classList.toggle("dark-theme");
}
}
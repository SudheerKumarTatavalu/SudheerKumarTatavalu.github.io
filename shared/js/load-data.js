/**
 * Data loading utility
 * Loads JSON data from shared/data directory and renders content
 */

document.addEventListener('DOMContentLoaded', function() {
  // Load skills data if skills section exists
  const skillsSection = document.getElementById('skills-section');
  if (skillsSection) {
    loadSkills();
  }
  
  // Load projects data if projects section exists
  const projectsSection = document.getElementById('projects-section');
  if (projectsSection) {
    loadProjects();
  }
});

/**
 * Loads skills data from skills.json and renders it
 */
async function loadSkills() {
  try {
    const response = await fetch('/shared/data/skills.json');
    if (!response.ok) throw new Error('Failed to fetch skills data');
    
    const skillsData = await response.json();
    renderSkills(skillsData);
    
  } catch (error) {
    console.error('Error loading skills:', error);
    document.getElementById('skills-section').innerHTML = `
      <div class="container">
        <h2 class="section-title">Skills</h2>
        <p class="text-center">Error loading skills data. Please try again later.</p>
      </div>
    `;
  }
}

/**
 * Renders skills data into the skills grid
 */
function renderSkills(skillsData) {
  const skillsGrid = document.querySelector('.skills-grid');
  if (!skillsGrid) return;
  
  skillsGrid.innerHTML = '';
  
  // Loop through skill categories
  Object.entries(skillsData).forEach(([category, skills]) => {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'skill-category';
    
    categoryEl.innerHTML = `
      <h3>${category}</h3>
      <div class="skill-list"></div>
    `;
    
    const skillList = categoryEl.querySelector('.skill-list');
    
    // Add each skill in the category
    skills.forEach(skill => {
      const skillItem = document.createElement('span');
      skillItem.className = 'skill-item';
      skillItem.textContent = skill;
      skillList.appendChild(skillItem);
    });
    
    skillsGrid.appendChild(categoryEl);
  });
}

/**
 * Loads projects data from the appropriate JSON file based on the current path
 */
async function loadProjects() {
  try {
    // Determine which projects file to load based on the path
    const path = window.location.pathname;
    let projectsFile = '';
    
    if (path.includes('/data-analyst/')) {
      projectsFile = 'analytics-projects.json';
    } else if (path.includes('/data-scientist/')) {
      projectsFile = 'ml-projects.json';
    } else {
      throw new Error('Unknown path for projects');
    }
    
    const response = await fetch(`/shared/data/${projectsFile}`);
    if (!response.ok) throw new Error(`Failed to fetch ${projectsFile}`);
    
    const projectsData = await response.json();
    renderProjects(projectsData);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-section').innerHTML = `
      <div class="container">
        <h2 class="section-title">Projects</h2>
        <p class="text-center">Error loading projects data. Please try again later.</p>
      </div>
    `;
  }
}

/**
 * Renders projects data into the projects grid
 */
function renderProjects(projectsData) {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;
  
  projectsGrid.innerHTML = '';
  
  // Loop through projects
  projectsData.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Create image element if project has an image
    let imageHtml = '';
    if (project.image) {
      imageHtml = `<img src="${project.image}" alt="${project.title}" class="project-image">`;
    }
    
    // Create technologies list
    let techHtml = '';
    if (project.technologies && project.technologies.length) {
      techHtml = `
        <div class="project-tech">
          ${project.technologies.map(tech => `<span class="project-tech-item">${tech}</span>`).join('')}
        </div>
      `;
    }
    
    // Create links
    let linksHtml = '';
    if (project.github || project.live) {
      linksHtml = `
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" class="btn btn-outline btn-sm" target="_blank">GitHub</a>` : ''}
          ${project.live ? `<a href="${project.live}" class="btn btn-primary btn-sm" target="_blank">Live Demo</a>` : ''}
        </div>
      `;
    }
    
    projectCard.innerHTML = `
      ${imageHtml}
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        ${techHtml}
        ${linksHtml}
      </div>
    `;
    
    projectsGrid.appendChild(projectCard);
  });
}
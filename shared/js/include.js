/**
 * Component inclusion utility
 * Loads HTML components from shared/components directory
 */

document.addEventListener('DOMContentLoaded', function() {
  // Include all components with data-include attribute
  includeComponents();
  
  // After components are loaded, set up the navigation
  setTimeout(() => {
    setupNavigation();
    setupMobileMenu();
    setCurrentYear();
    setRoleSpecificContent();
  }, 100);
});

async function includeComponents() {
  const elements = document.querySelectorAll('[data-include]');
  
  for (let element of elements) {
    const file = element.getAttribute('data-include');
    
    try {
      const response = await fetch(`/shared/components/${file}`);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      
      const content = await response.text();
      element.innerHTML = content;
      element.removeAttribute('data-include');
      
    } catch (error) {
      console.error(`Error including component ${file}:`, error);
      element.innerHTML = `<p>Error loading component: ${file}</p>`;
    }
  }
}

function setupNavigation() {
  // Get current page path
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  // Find all navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Set active class based on current page
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === page || (page === 'index.html' && linkHref === '')) {
      link.classList.add('active');
    }
    
    // Special case for hash links (like #contact)
    if (linkHref.startsWith('#') && window.location.hash === linkHref) {
      link.classList.add('active');
    }
  });
  
  // Scroll handling for header
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function setupMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
        navMenu.classList.remove('active');
      }
    });
  }
}

function setCurrentYear() {
  const yearElements = document.querySelectorAll('#current-year');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

function setRoleSpecificContent() {
  // Determine which role we're in based on the URL path
  const path = window.location.pathname;
  let roleTitle = '';
  let themeClass = '';
  
  if (path.includes('/data-analyst/')) {
    roleTitle = 'Data Analyst';
    themeClass = 'analyst-theme';
  } else if (path.includes('/data-scientist/')) {
    roleTitle = 'Data Scientist';
    themeClass = 'scientist-theme';
  }
  
  // Set role-specific title if element exists
  const roleTitleElement = document.getElementById('role-title');
  if (roleTitleElement && roleTitle) {
    roleTitleElement.textContent = roleTitle;
  }
  
  // Apply theme class to body if needed
  if (themeClass) {
    document.body.classList.add(themeClass);
  }
}
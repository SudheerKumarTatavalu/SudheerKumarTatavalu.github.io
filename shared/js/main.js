/**
 * Main script for site-wide functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  setupSmoothScrolling();
  
  // Set up any interactive elements
  setupInteractions();
});

/**
 * Sets up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Offset for fixed header
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL but without scrolling (already handled above)
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Sets up other interactive elements
 */
function setupInteractions() {
  // Any animations, hover effects, etc.
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animateElements.length > 0) {
    // Simple scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Project filter if exists
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filter = this.getAttribute('data-filter');
        
        // Filter projects
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(project => {
          if (filter === 'all') {
            project.style.display = 'block';
          } else {
            const tags = project.getAttribute('data-tags');
            if (tags && tags.includes(filter)) {
              project.style.display = 'block';
            } else {
              project.style.display = 'none';
            }
          }
        });
      });
    });
  }
}

/**
 * Add to animation queue for staggered animations
 */
function animateElement(element, animation, delay = 0) {
  setTimeout(() => {
    element.classList.add(animation);
  }, delay);
}
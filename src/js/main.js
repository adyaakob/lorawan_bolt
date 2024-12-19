document.addEventListener('DOMContentLoaded', () => {
    console.log('LoRaWAN Worker Tracking Project Website Loaded');

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);

    // Ensure light theme is always the default
    body.classList.remove('dark');
    body.classList.add('light');
    themeToggle.textContent = 'Dark Theme';

    themeToggle.addEventListener('click', () => {
      const currentTheme = body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(currentTheme);
    });

    function setTheme(theme) {
      if (theme === 'dark') {
        body.classList.add('dark');
        body.classList.remove('light');
        themeToggle.textContent = 'Light Theme';
      } else {
        body.classList.add('light');
        body.classList.remove('dark');
        themeToggle.textContent = 'Dark Theme';
      }
      localStorage.setItem('theme', theme);
    }
  });

  // Dropdown Menu Functionality
  const dropdownContainers = document.querySelectorAll('.dropdown-container');

  dropdownContainers.forEach(container => {
    const trigger = container.querySelector('.dropdown-trigger');
    const menu = container.querySelector('.dropdown-menu');

    // Close all other dropdowns when one is opened
    function closeOtherDropdowns(currentContainer) {
      dropdownContainers.forEach(otherContainer => {
        if (otherContainer !== currentContainer) {
          otherContainer.querySelector('.dropdown-menu').classList.add('hidden');
        }
      });
    }

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click from immediately closing
      closeOtherDropdowns(container);
      menu.classList.toggle('hidden');
    });

    // Prevent dropdown from closing when clicking inside the menu
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    dropdownContainers.forEach(container => {
      container.querySelector('.dropdown-menu').classList.add('hidden');
    });
  });

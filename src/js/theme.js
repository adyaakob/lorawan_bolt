const themeToggle = document.getElementById('themeToggle');
  const body = document.documentElement;

  const getStoredTheme = () => localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const setTheme = (theme) => {
    body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  };

  const updateThemeIcon = (theme) => {
    const sunIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.773l-1.591 1.591M5.25 12H3m.386-6.364l1.591 1.591M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    `;
    const moonIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    `;
    
    themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  };

  // Initial theme setup
  setTheme(getStoredTheme());

  // Theme toggle event listener
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(currentTheme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    setTheme(newTheme);
  });

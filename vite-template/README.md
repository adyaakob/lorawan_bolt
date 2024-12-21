# Vite Multi-Page Application Template

## Project Structure

```
project-root/
│
├── index.html           # Main entry point
├── pages/               # Additional HTML pages
│   ├── page1.html
│   └── page2.html
│
├── src/
│   ├── main.js          # Main JavaScript entry
│   ├── styles/
│   │   └── main.css     # Global styles
│   └── scripts/         # Page-specific scripts
│       ├── page1.js
│       └── page2.js
│
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions workflow
│
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## Prerequisites

- Node.js (v18 or later)
- npm

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/your-project.git
cd your-project
```

2. Install dependencies
```bash
npm install
```

## Development Workflow

- Start development server
```bash
npm run dev
```

- Build for production
```bash
npm run build
```

- Preview production build
```bash
npm run preview
```

- Deploy to GitHub Pages
```bash
npm run deploy
```

## Vite Configuration

Configured in `vite.config.js`:
- Multi-page application support
- GitHub Pages base path
- Build optimizations

## GitHub Actions

Automated deployment to GitHub Pages:
- Triggered on push to main branch
- Builds and deploys the project
- Configurable Node.js version

## Best Practices

- Keep pages in `pages/` directory
- Use `src/scripts/` for page-specific logic
- Maintain clean, modular code structure

## Troubleshooting

- Ensure base path is correct in `vite.config.js`
- Check GitHub Pages settings in repository
- Verify all entry points are defined

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]

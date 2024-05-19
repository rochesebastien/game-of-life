# Game of Life - React & Vite

Welcome to the "Game of Life" project, developed using React and Vite as the bundler. This project implements the cellular automaton known as the "Game of Life", invented by mathematician John Horton Conway.

# Table of Contents

1. Project Overview
2. Features
3. Prerequisites
4. Installation
5. Usage
6. Project Structure
7. Contribution
8. License


# Project Overview
The "Game of Life" is a cellular automaton where cells live or die based on simple rules. This project uses React for the user interface and Vite for bundling, offering a fast and modern development experience.

# Features
- Interactive Grid: Click to toggle cell states (alive or dead).
- Start/Pause: Control the evolution of the grid with start and pause buttons.
- Adjustable Speed: Change the speed of the generation evolution.
- Reset: Reset the grid to its initial state.

# Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

# Installation

1. Clone the repository:

```
https://github.com/rochesebastien/game-of-life.git
game-of-life
```

2. Install dependencies:
```bash
npm install
# or 
yarn install
```

# Usage
Start the development server:


```bash
npm run dev
# or
yarn dev
```
Open your browser and go to http://localhost:5173.

# Project Structure
```
game-of-life-react-vite/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── Cell.jsx        # Cell component
│   │   ├── Grid.jsx        # Grid component
│   │   ├── Controls.jsx    # Controls component
│   ├── styles/             # CSS styles
│   ├── App.jsx             # Main component
│   ├── main.jsx            # Application entry point
├── index.html              # Main HTML file
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

# Contribution
Contributions are welcome! If you would like to contribute, please follow these steps:

- Fork the repository.
- Create a branch for your feature (git checkout -b feature-new-feature).
- Commit your changes (git commit -m 'feat/fix(scope): description').
- Push your branch (git push origin feature-new-feature).
- Open a Pull Request.

# License
This project is licensed under the MIT License. See the LICENSE file for more details. (Will be added lataer)

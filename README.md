# CardVault - Smart Card Management Application

## Overview

CardVault is a modern, user-friendly web application designed to help students, professionals, and lifelong learners organize their knowledge efficiently through customizable knowledge cards. Easily create, categorize, and track your learning progress with an intuitive and stylish interface.

## Features

- Create, edit, and delete knowledge cards with detailed titles, content, and tags.
- Organize cards by subjects and categories with smart filters.
- View dashboard overview with statistics for total cards, subjects, tags, and recent activity.
- Responsive and modern UI powered by Bootstrap and custom styles.
- Import and export your card database as JSON for backup or sharing.
- Quick search functionality to find cards instantly.
- Modal dialogs for seamless card and subject creation and editing.
- Persistent storage utilizing browser's localStorage.

## Installation

1. Clone or download this repository.
2. Open the project directory in your preferred code editor (e.g., VS Code).
3. You can run the application in a local web server environment:

### Using Python HTTP Server

```bash
python -m http.server 8000
```

### Using Node.js http-server

```bash
npm install -g http-server
http-server
```

### Using Live Server Extension in VS Code

Right-click on `index-modern.html` and select "Open with Live Server".

4. Open your browser and navigate to `http://localhost:8000/index-modern.html`.

## Usage

- Use the navigation sidebar to access different sections: Dashboard, All Cards, Add Subject, Add Card.
- Create new subjects to categorize your cards.
- Add cards specifying subject, title, content and tags for better organization.
- View detailed card information in modals.
- Use search and filter options to quickly locate cards.
- Backup your card data by exporting it as a JSON file, and restore it later by importing.

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Font Awesome icons
- LocalStorage API

## Screenshorts

<img width="1876" height="901" alt="Screenshot 2025-07-12 174828" src="https://github.com/user-attachments/assets/a255c3cb-04a0-4334-9fcd-0ffc7437d498" />



## Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

## License

[MIT License](LICENSE)

# React Shop Admin Panel

A comprehensive admin panel built with React and TypeScript for managing e-commerce shops. This application provides a modern interface for managing products, categories, orders, users, and content pages.

## Features

- **User Management**: Create, edit, and manage user accounts
- **Product Management**: Full CRUD operations for products with image uploads
- **Category Management**: Organize products with hierarchical categories
- **Order Management**: Track and manage customer orders
- **Content Management**: Manage static pages and custom elements
- **Authentication**: Secure login system with user profiles
- **Modern UI**: Built with Material-UI components for a professional look
- **TypeScript**: Full type safety for better development experience

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Rich Text Editor**: Draft.js
- **File Uploads**: React Dropzone
- **Drag & Drop**: react-beautiful-dnd
- **Build Tool**: Create React App

## Prerequisites

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Prerequisites

- Node.js 16+ 
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-shop-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
│   ├── users/     # User management pages
│   ├── products/  # Product management pages
│   ├── categories/# Category management pages
│   ├── pages/     # Static page management
│   └── elements/  # Custom element management
├── models/        # TypeScript interfaces and types
├── redux/         # Redux store and slices
└── css/           # Custom styles
```

## API Configuration

The application expects a REST API backend. Configure your API endpoints in the appropriate service files. Make sure your backend provides endpoints for:

- Authentication (`/login`, `/profile`)
- Users CRUD operations
- Products CRUD operations
- Categories CRUD operations
- Orders management
- Pages and Elements management

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://your-api-url.com
REACT_APP_API_KEY=your-api-key-if-needed
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the repository.

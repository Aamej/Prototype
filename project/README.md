# Prototypr - Workflow Automation Platform

Prototypr is a modern workflow automation platform that allows users to build, visualize, and deploy powerful automation workflows without writing a single line of code.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating workflows
- **User Authentication**: Secure signup, login, and user management
- **Modern UI**: Beautiful and intuitive user interface
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Flow Visualization**: React Flow
- **Authentication**: JWT, bcryptjs

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prototypr.git
   cd prototypr
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   JWT_SECRET=your-secret-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/public`: Static assets

## Authentication

The application uses JWT-based authentication with HTTP-only cookies for security. User data is stored in memory for demonstration purposes, but in a production environment, you would use a database.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the workflow visualization
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling 
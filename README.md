# Resume Builder

A full-stack web application for creating professional resumes and cover letters with real-time PDF generation. Built with React, TypeScript, Material-UI, and Express.js.

## Features

- **Interactive Form Builder**: Create resumes with a clean, user-friendly interface
- **Real-time Preview**: See your resume as you build it
- **PDF Generation**: Download professional PDFs of your resume and cover letter
- **Cover Letter Support**: Create matching cover letters alongside your resume
- **Sample Data**: Quickly fill forms with sample data to get started

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for components and styling
- **Vite** for fast development and building

### Backend
- **Express.js** server for PDF generation
- **Puppeteer** for rendering PDFs from HTML
- **CORS** enabled for cross-origin requests

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chris-hammond-ross/resume-builder.git
   cd resume-builder
   ```

2. **Install all dependencies** (both client and server)
   ```bash
   npm run install
   ```

   This command will:
   - Install dependencies for the main React app
   - Navigate to the `server` directory and install server dependencies

## Running the Application

### Development Mode

To start both the frontend and backend servers simultaneously:

```bash
npm run dev
```

This will start:
- **Frontend**: React development server on `http://localhost:5173` (or next available port)
- **Backend**: Express server on `http://localhost:3001`

You'll see colored output in your terminal:
- 🟢 **SERVER**: Backend logs in green
- 🔵 **CLIENT**: Frontend logs in cyan

### Individual Services

If you need to run services separately:

**Frontend only:**
```bash
npm run frontend
```

**Backend only:**
```bash
npm run server
```

## Project Structure

```
resume-builder/
├── src/                        # React frontend source code
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── constants/              # Application constants
├── server/                     # Express.js backend
│   ├── server.js               # Main server file
│   └── package.json            # Server dependencies
├── package.json                # Main project dependencies
└── README.md                   # This file
```

## How to Use

1. **Start the application** using `npm run dev`
2. **Open your browser** to `http://localhost:5173`
3. **Fill out the form** with your information:
   - Enter your name and professional summary
   - Add skills and abilities
   - Include work experience
   - Add education details
   - Optionally include technical skills, hobbies, and references
4. **Switch to Cover Letter tab** to create a matching cover letter
5. **Use "Fill Sample Data"** to quickly populate forms with example data
6. **Click "Save PDF"** to download your resume or cover letter as a PDF

## API Endpoints

The backend server provides the following endpoints:

- `POST /api/generate-resume-pdf` - Generate and download resume PDF
- `POST /api/generate-cover-letter-pdf` - Generate and download cover letter PDF
- `POST /api/preview-resume-pdf` - Generate resume PDF for browser preview
- `POST /api/preview-cover-letter-pdf` - Generate cover letter PDF for browser preview

## License

This project is licensed under the ISC License.
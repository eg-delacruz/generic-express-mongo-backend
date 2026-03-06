# Generic Express MongoDB Backend

A ready-to-use backend template built with Express.js and MongoDB. This repository serves as a starting point for building RESTful APIs for any project, providing a solid foundation with best practices and commonly used features.

## ✨ Features

- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - Local MongoDB connection with Mongoose ODM
- **TypeScript** - Type-safe code for better development experience
- **Docker Support** - Containerized setup for consistent development environment
- **File Uploads** - Pre-configured file upload handling
- **Environment Configuration** - Easy configuration via environment variables
- **RESTful API Structure** - Organized folder structure following best practices

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Local)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/) and Docker Compose

That's it! Node.js (v20), pnpm, MongoDB, and all other dependencies run inside the containers.

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd generic-express-mongo-backend
```

2. Start the services:
```bash
docker-compose up --build -d
```

The backend will be available at `http://localhost:3000` (or the port specified in your configuration).

To do a quick test, you can access the health check endpoint in your browser or via curl:
```bash
curl http://localhost:3000/api/health
```

## 📂 File Upload & Storage

This template includes pre-configured file upload handling with two important directories:

### `uploads/` Directory

Used to store and serve uploaded files during development.

- **Local Access**: Mounted as a bind mount (`./uploads:/app/uploads`), making files directly accessible on your host machine
- **Access**: Files are served at `http://localhost:3000/uploads/filename`
- **API Integration**: Uploaded files through your API endpoints are stored here

**Example**: Place `image.png` in this directory to access it at `http://localhost:3000/uploads/image.png`

### `seed_images/` Directory

Contains example images for testing and documentation purposes.

- **Purpose**: Demonstrates how images are stored and served in the application
- **Usage**: Copy files from here to `./uploads/` to test the image serving endpoint
- **Reference**: Serves as a guide for expected file formats and structure

**How to use**: Copy any file from `seed_images/` to `uploads/`, then access it via `http://localhost:3000/uploads/your-file`

## 🐳 Docker Compose Setup

This project uses `docker-compose.yml` which is configured for **local development only**:

- **MongoDB**: Configured with persistent volume for local database
- **Backend**: Uses bind mounts for all development directories
  - `./backend:/app` - Full access to source code
  - `./uploads:/app/uploads` - Direct access to uploaded files on your host machine
  - Named volumes for `node_modules` and pnpm cache to avoid conflicts

This setup prioritizes **ease of development** by allowing you to directly edit files and access uploads from your host filesystem.

### Example Endpoints

```
GET    /api/health          # Health check endpoint
POST   /api/...             # Add your endpoints
GET    /api/...             # Add your endpoints
```

## 🎯 Usage

This template is meant to be **forked or cloned** and customized for your specific project needs:

1. **Clone/Fork** this repository
2. **Customize** the models, routes, and controllers based on your requirements
3. **Add** your business logic and API endpoints
4. **Configure** environment variables for your specific use case
5. **Deploy** to your preferred hosting platform

**Note**: This is a starter template. Customize it according to your project requirements. Remember to update this README as you add new features and endpoints to your API.

## ⚠️ Production Deployment

This template is currently configured for **local development only**. To deploy this project to production, you'll need to make significant changes:

### Docker & Docker Compose

**Development vs Production differences:**
- Remove bind mounts (`./ ` paths) - these are only for local development
- Use Docker named volumes or remove local file storage entirely
- Set `NODE_ENV: production` instead of `development`
- Update `command` to run production build instead of dev server (`pnpm run build && pnpm start`)
- Remove `stdin_open`, `tty`, and `init` flags
- Add proper restart policies and health checks
- Consider multi-stage builds to reduce image size

**Example changes needed in `docker-compose.yml`:**
```yaml
backend:
  # ... other config
  environment:
    NODE_ENV: production  # Change from development
  command: pnpm start     # Use production command, not dev
  # Remove: stdin_open, tty, init
  restart: always         # Add restart policy
  # Remove or change: bind mounts like ./backend:/app
```

### Database Configuration

**Switch from local MongoDB to a remote database:**
- Replace the local MongoDB service with a remote MongoDB instance
- Examples: MongoDB Atlas, AWS DocumentDB, or your own managed MongoDB server
- Update `MONGO_URI` environment variable to point to your remote database
- Ensure proper authentication credentials are set via environment variables
- Consider database encryption, backups, and monitoring

**Update `.env` for production:**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/database-name
# Never commit real credentials - use secret management tools
```

### File Storage

**Switch from local filesystem to cloud storage:**
- **Remove** the local `uploads/` directory approach
- **Implement** cloud storage integration (AWS S3, Google Cloud Storage, Azure Blob, etc.)
- Update your file upload endpoints to upload directly to the cloud service
- Use pre-signed URLs or CDN for serving files securely
- Benefits: scalability, durability, multi-region support, backup management

**Popular choices:**
- **AWS S3** - Industry standard, excellent documentation
- **Google Cloud Storage** - Integration with Google Cloud ecosystem
- **Azure Blob Storage** - Integration with Microsoft Azure
- **Cloudinary** - Specialized for images with built-in optimization

**Example S3 implementation:**
- Install SDK: `pnpm add aws-sdk`
- Update upload routes to use S3 client
- Remove local file serving code
- Use pre-signed URLs for file access

### Environment Variables & Secrets

**Production security:**
- Use a secrets management tool (AWS Secrets Manager, HashiCorp Vault, etc.)
- Never commit `.env` files with production credentials to Git
- Rotate secrets periodically
- Use strong, unique passwords for databases and API keys

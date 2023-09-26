# Weeks in Hell 🥵

## Description

The Weeks in Hell tracker is a web application designed to help users track their eating and workout habits. The app provides a calendar interface where users can mark their daily and weekly progress using color-coded boxes. Multiple users can be added to the app, making it suitable for families or groups for a little friendly competition.

<img width="1235" alt="weeks-in-hell-screenshot" src="https://github.com/Chr1sCon/weeks-in-hell/assets/20434300/550bb7fa-0f4a-4484-9081-d7d93c18c2a0">

## Features

- Individual calendars for each user
- Color-coded tracking for daily and weekly progress
- Responsive design for desktop and mobile
- Data stored in a JSON file
- Built using Node.js and Bootstrap

## Prerequisites

- Node.js
- npm

## Installation

Clone the repository:

```bash
git clone https://github.com/Chr1sCon/weeks-in-hell.git
```

Navigate to the project directory:

```bash
cd weeks-in-hell
```

Install dependencies:

```bash
npm install
```

## Running the App

Start the application:

```bash
node app.js
```

Open your web browser and navigate to:

```
http://localhost:3000
```

## Deploying as a Container

To deploy this app as a container, you'll need to have Docker installed on your machine. Once Docker is installed, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t weeks-in-hell .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 weeks-in-hell
   ```

Now the app should be accessible at \`http://localhost:3000\`.

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## License

MIT

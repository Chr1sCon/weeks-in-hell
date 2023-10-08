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

2. Run the Docker container with persistent storage:

```bash
docker run -p 3000:3000 -v /path/to/local/folder:/usr/src/app/data weeks-in-hell
```

Now the app should be accessible at \`http://localhost:3000\`.

## Push to Docker Hub Script

### Usage:
- To auto-increment the version by 0.01:
  `./pushToDocker.sh`

- To specify a version manually:
  `./pushToDocker.sh 2.00`

### Docker compose example
```
version: "3.7"

services:
  weeks-in-hell:
    image: chr1scon/weeks-in-hell:latest
    container_name: weeks-in-hell
    restart: unless-stopped  
    volumes:
      - /home/chris/docker/weeks-in-hell/data:/usr/src/app/data   
    ports:
      - "3002:3002"
    environment:
      - TZ="Europe/Oslo"
    networks:
      macvlan:
        ipv4_address: 10.24.10.118

networks:
  macvlan:
    external: true
````

## Data Persistence

The app stores its data in a JSON file. If you're running the app as a Docker container, you'll want to map a local folder to the container to ensure that the JSON data persists.

1. Identify the path where the JSON file is stored within the container. As default, this should be /usr/src/app/data/.

2. Choose a local folder where you want to store the JSON file. For example, /Users/yourusername/weeks-in-hell-data.

3. Run the Docker container, mapping the local folder to the folder in the container:

```bash
docker run -p 3000:3000 -v /Users/yourusername/weeks-in-hell-data:/app/data weeks-in-hell
```

This will ensure that the JSON file is saved on your local machine, even if the Docker container is stopped or removed.

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## License

MIT

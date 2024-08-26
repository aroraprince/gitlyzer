# GitHub and GitLab Language Analyzer

## Overview
This project fetches and analyzes the programming languages used in a user's public repositories on GitHub and GitLab. It calculates the top five languages based on the total bytes of code written in each language.

## Libraries Used
- **TypeScript**: For type-safe JavaScript.
- **JavaScript**: For general scripting.
- **npm**: For package management.
- **@octokit/rest**: For interacting with the GitHub API.
- **@gitbeaker/node**: For interacting with the GitLab API.
- **dotenv**: For loading environment variables.
- **@inquirer/prompts**: For command-line prompts.

## Setup and Run Locally

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- GitHub and GitLab API keys

## Installation Steps
### Clone the repository:  
- git clone <repository-url>
- cd <repository-directory>

### Install dependencies:  
```
npm install
```

Set up environment variables: Create a .env file in the root directory and add your GitHub and GitLab API keys:  
```
GITHUB_API_KEY=your_github_api_key
GITLAB_API_KEY=your_gitlab_api_key
```

### Run the application:
```
npx tsc
node dist/index.js
```


### Running the Code
The application will prompt you to enter a complete profile URL (either GitHub or GitLab).
It will then fetch the language data for the specified user and display the top five languages used.

### Test Cases
Test cases have been attempted but remain incomplete due to limited time spent. Further work is needed to ensure comprehensive test coverage.

### Additional Details
Ensure that your API keys have the necessary permissions to access user repositories.
The application handles rate limits and user not found errors gracefully, providing appropriate messages.


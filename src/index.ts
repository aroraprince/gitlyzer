import dotenv from "dotenv";
import { input } from '@inquirer/prompts';
import { getGitLabLanguages } from "./gitlab.js";
import { getGitHubLanguages } from "./github.js";

dotenv.config();

async function getProfileURL(): Promise<string> {
  try {
    const profileURL = await input({ message: 'Enter complete profile URL:' });
    new URL(profileURL); // Validate URL format
    return profileURL;
  } catch (error) {
    console.error("Invalid URL format. Please enter a valid URL.");
    process.exit(1);
  }
}

function calculateTopLanguages(languages: { [key: string]: number }) {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  if (totalBytes === 0) {
    return [];
  }
  const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  return sortedLanguages.slice(0, 5).map(([language, bytes]) => ({
    language,
    percentage: ((bytes / totalBytes) * 100).toFixed(2),
  }));
}

export async function main() {
  const profileURL = await getProfileURL();
  const url = new URL(profileURL);
  const username = url.pathname.split("/")[1];
  let languages: { [key: string]: number } = {};

  try {
    if (url.hostname.includes("github.com")) {
      languages = await getGitHubLanguages(username);
    } else if (url.hostname.includes("gitlab.com")) {
      languages = await getGitLabLanguages(username);
    } else {
      console.error("Unsupported URL. Please enter a GitHub or GitLab profile URL.");
      return;
    }

    if (Object.keys(languages).length === 0) {
      console.log("No language data available for this user.");
      return;
    }

    const topLanguages = calculateTopLanguages(languages);
    if (topLanguages.length === 0) {
      console.log("No language data available for this user.");
      return;
    }

    console.log("Five most used languages:");
    topLanguages.forEach(({ language, percentage }) => {
      console.log(`* ${language} (${percentage}%)`);
    });
  } catch (error) {
    console.error("An error occurred while fetching language data:", (error as Error).message);
  }
}

main().catch(console.error);
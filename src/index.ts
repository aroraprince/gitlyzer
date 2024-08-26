import dotenv from "dotenv";
import { input } from '@inquirer/prompts';
import {getGitLabLanguages} from "./gitlab.js";
import {getGitHubLanguages} from "./github.js";


dotenv.config();

const profileURL = await input({ message: 'Enter complete profile URL:' });


function calculateTopLanguages(languages: { [key: string]: number }) {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  return sortedLanguages.slice(0, 5).map(([language, bytes]) => ({
    language,
    percentage: ((bytes / totalBytes) * 100).toFixed(2),
  }));
}

export async function main() {
  const url = new URL(profileURL);
  const username = url.pathname.split("/")[1];
  let languages: { [key: string]: number } = {};

  if (url.hostname.includes("github.com")) {
    languages = await getGitHubLanguages(username);
  } else if (url.hostname.includes("gitlab.com")) {
    languages = await getGitLabLanguages(username);
  } else {
    console.error("Unsupported URL");
    return;
  }

  const topLanguages = calculateTopLanguages(languages);
  console.log("Five most used languages:");
  topLanguages.forEach(({ language, percentage }) => {
    console.log(`* ${language} (${percentage}%)`);
  });
}

main().catch(console.error);
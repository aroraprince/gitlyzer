import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

async function getGitHubLanguages(username: string) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY,
  });
  const repos = await octokit.repos.listForUser({ username });
  const languages: { [key: string]: number } = {};

  for (const repo of repos.data) {
    const repoLanguages = await octokit.repos.listLanguages({
      owner: username,
      repo: repo.name,
    });
    for (const [language, bytes] of Object.entries(repoLanguages.data)) {
      languages[language] = (languages[language] || 0) + bytes;
    }
  }

  return languages;
}

function calculateTopLanguages(languages: { [key: string]: number }) {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  return sortedLanguages.slice(0, 5).map(([language, bytes]) => ({
    language,
    percentage: ((bytes / totalBytes) * 100).toFixed(2),
  }));
}

async function main() {
  const profileUrl = "https://github.com/airbnb";
  const url = new URL(profileUrl);
  const username = url.pathname.split("/")[1];
  let languages: { [key: string]: number } = {};

  if (url.hostname.includes("github.com")) {
    languages = await getGitHubLanguages(username);
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
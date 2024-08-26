// src/github.ts
import { Octokit } from "@octokit/rest";

export async function getGitHubLanguages(username: string): Promise<{ [key: string]: number }> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY,
  });

  try {
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
  } catch (error) {
    const typedError = error as { status?: number; message: string };
    if (typedError.status === 404) {
      console.error(`User ${username} not found.`);
      return {};
    } else {
      console.error("An error occurred in getGitHubLanguages:", typedError.message);
      throw typedError;
    }
  }
}
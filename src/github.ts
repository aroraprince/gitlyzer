import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export async function getGitHubLanguages(username: string): Promise<{ [key: string]: number }> {
  try {
    const { data: repos } = await octokit.repos.listForUser({ username });
    if (repos.length === 0) {
      console.log("No repositories found for this user.");
      return {};
    }

    const languages: { [key: string]: number } = {};
    for (const repo of repos) {
      const { data: repoLanguages } = await octokit.repos.listLanguages({
        owner: username,
        repo: repo.name,
      });

      for (const [language, bytes] of Object.entries(repoLanguages)) {
        if (languages[language]) {
          languages[language] += bytes;
        } else {
          languages[language] = bytes;
        }
      }
    }

    return languages;
  } catch (error) {
    if ((error as any).status === 404) {
      console.error("GitHub user not found.");
    } else if ((error as any).status === 403) {
      console.error("Rate limit exceeded. Please try again later.");
    } else {
      console.error("An error occurred while fetching data from GitHub:", (error as Error).message);
    }
    return {};
  }
}
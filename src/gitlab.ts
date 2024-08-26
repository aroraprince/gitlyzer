// src/gitlab.ts
import { Gitlab } from "@gitbeaker/node";
import dotenv from "dotenv";
import { UserNotFoundError } from "./errors.js";
dotenv.config();

export async function getGitLabLanguages(username: string): Promise<{ [key: string]: number }> {
  const api = new Gitlab({
    token: process.env.GITLAB_API_KEY,
  });

  try {
    // Fetch user details to get the user ID
    const users = await api.Users.all({ username });
    if (users.length === 0) {
      throw new UserNotFoundError('User not found');
    }
    const userId = users[0].id;

    const projects = await api.Users.projects(userId);
    const languages: { [key: string]: number } = {};

    for (const project of projects) {
      const repoLanguages: { [key: string]: number } = await api.Projects.languages(project.id);
      for (const [language, percentage] of Object.entries(repoLanguages)) {
        languages[language] = (languages[language] || 0) + percentage;
      }
    }

    return languages;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      console.error("User not found:", error.message);
    } else {
      console.error("An error occurred in getGitLabLanguages:", (error as Error).message);
    }
    return {}; // Re-throw the error after logging it
  }
}
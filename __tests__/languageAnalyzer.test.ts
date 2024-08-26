import { getGitHubLanguages } from '../src/github';
import { getGitLabLanguages } from '../src/gitlab';

describe('Language Analyzer', () => {
  it('should fetch languages from GitHub', async () => {
    const languages = await getGitHubLanguages('github-username');
    expect(languages).toBeDefined();
    expect(Object.keys(languages).length).toBeGreaterThan(0);
  });

  it('should fetch languages from GitLab', async () => {
    const languages = await getGitLabLanguages('gitlab-username');
    expect(languages).toBeDefined();
    expect(Object.keys(languages).length).toBeGreaterThan(0);
  });
});
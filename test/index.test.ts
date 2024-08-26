// test/index.test.ts
import { getGitHubLanguages } from '../src/github.js';
import { getGitLabLanguages } from '../src/gitlab.js';
import { input } from '@inquirer/prompts';

// Add this line to include Jest type definitions
import 'jest';
import {main} from "../src/index.js";

jest.mock('../src/github');
jest.mock('../src/gitlab');
jest.mock('@inquirer/prompts');

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle GitHub URL', async () => {
    (input as jest.MockedFunction<typeof input>).mockResolvedValue('https://github.com/validUser');
    (getGitHubLanguages as jest.MockedFunction<typeof getGitHubLanguages>).mockResolvedValue({ JavaScript: 100 });

    console.log = jest.fn();
    await main();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('JavaScript'));
  });

  it('should handle GitLab URL', async () => {
    (input as jest.MockedFunction<typeof input>).mockResolvedValue('https://gitlab.com/validUser');
    (getGitLabLanguages as jest.MockedFunction<typeof getGitLabLanguages>).mockResolvedValue({ JavaScript: 100 });

    console.log = jest.fn();
    await main();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('JavaScript'));
  });

  it('should handle unsupported URL', async () => {
    (input as jest.MockedFunction<typeof input>).mockResolvedValue('https://bitbucket.org/validUser');

    console.error = jest.fn();
    await main();
    expect(console.error).toHaveBeenCalledWith('Unsupported URL');
  });
});
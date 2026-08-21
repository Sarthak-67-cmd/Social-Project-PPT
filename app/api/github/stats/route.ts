import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      return NextResponse.json(
        {
          error:
            "GitHub environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const octokit = new Octokit({
      auth: token,
    });

    // Get commits from the repository
    const commits = await octokit.paginate(
      octokit.rest.repos.listCommits,
      {
        owner,
        repo,
        per_page: 100,
      }
    );

    // Start all member counts at zero
    const members = {
      Sarthak: 0,
      Srihita: 0,
      Charvik: 0,
    };

    // Convert GitHub commits into tracker updates
    const updates = commits.map((commit) => {
      const message =
        commit.commit.message.split("\n")[0];

      const lowerMessage = message.toLowerCase();

      let person = "Unknown";

      /*
       * IMPORTANT:
       * We detect the tracker member from the commit
       * message FIRST.
       *
       * Example:
       *
       * "Sarthak: Added introduction"
       * "Srihita: Added research"
       * "Charvik: Added images"
       */

      if (lowerMessage.startsWith("sarthak:")) {
        person = "Sarthak";
      } else if (
        lowerMessage.startsWith("srihita:")
      ) {
        person = "Srihita";
      } else if (
        lowerMessage.startsWith("charvik:")
      ) {
        person = "Charvik";
      }

      // Increase that person's commit count
      if (person !== "Unknown") {
        members[person as keyof typeof members]++;
      }

      return {
        sha: commit.sha,
        person,
        message,
        date:
          commit.commit.author?.date ||
          commit.commit.committer?.date ||
          null,
      };
    });

    return NextResponse.json({
      members,
      total: commits.length,
      updates: updates.slice(0, 20),
    });
  } catch (error) {
    console.error(
      "GitHub stats error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load GitHub data.",
      },
      { status: 500 }
    );
  }
}
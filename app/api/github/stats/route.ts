import { NextResponse } from "next/server";

type MemberName =
  | "Sarthak"
  | "Srihita"
  | "Charvik"
  | "Lohitaksh";

type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string | null;
    } | null;
  };
  author: {
    login: string;
  } | null;
};

export async function GET() {
  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    if (!owner || !repo || !token) {
      return NextResponse.json(
        {
          error:
            "GitHub environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
      {
        headers: {
          Accept:
            "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version":
            "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "GitHub API error:",
        response.status,
        text
      );

      return NextResponse.json(
        {
          error: `GitHub API error: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const commits =
      (await response.json()) as GitHubCommit[];

    const members: Record<
      MemberName,
      number
    > = {
      Sarthak: 0,
      Srihita: 0,
      Charvik: 0,
      Lohitaksh: 0,
    };

    const updates = commits.map(
      (commit) => {
        const message =
          commit.commit.message
            .split("\n")[0]
            .trim();

        /*
         * Our commit messages are created like:
         *
         * Sarthak: Added introduction
         * Srihita: Added research
         * Charvik: Added images
         * Lohitaksh: Added conclusion
         *
         * We use the name at the beginning
         * to determine who made the update.
         */

        const lowerMessage =
          message.toLowerCase();

        let person:
          | MemberName
          | "Unknown" = "Unknown";

        if (
          lowerMessage.startsWith(
            "sarthak:"
          )
        ) {
          person = "Sarthak";
        } else if (
          lowerMessage.startsWith(
            "srihita:"
          )
        ) {
          person = "Srihita";
        } else if (
          lowerMessage.startsWith(
            "charvik:"
          )
        ) {
          person = "Charvik";
        } else if (
          lowerMessage.startsWith(
            "lohitaksh:"
          )
        ) {
          person = "Lohitaksh";
        }

        if (person !== "Unknown") {
          members[person]++;
        }

        return {
          sha: commit.sha,
          person,
          message: message.replace(
            /^[^:]+:\s*/,
            ""
          ),
          date:
            commit.commit.author
              ?.date ?? null,
        };
      }
    );

    const total =
      members.Sarthak +
      members.Srihita +
      members.Charvik +
      members.Lohitaksh;

    return NextResponse.json({
      members,
      total,
      updates,
    });
  } catch (error) {
    console.error(
      "Stats route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load GitHub statistics.",
      },
      { status: 500 }
    );
  }
}
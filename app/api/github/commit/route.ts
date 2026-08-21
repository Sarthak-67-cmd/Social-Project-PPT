import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST(request: Request) {
  try {
    const { person, message } = await request.json();

    if (!person || !message?.trim()) {
      return NextResponse.json(
        { error: "Person and message are required." },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: "GitHub environment variables are missing." },
        { status: 500 }
      );
    }

    const octokit = new Octokit({
      auth: token,
    });

    const filename =
      `tracker-updates/${Date.now()}-${person.toLowerCase()}.md`;

    const content = `# ${message}

Member: ${person}
Time: ${new Date().toISOString()}
`;

    const result =
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filename,
        message: `${person}: ${message}`,
        content: Buffer.from(content).toString("base64"),
      });

    return NextResponse.json({
      success: true,
      sha: result.data.commit.sha,
    });
  } catch (error) {
    console.error("GitHub error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "GitHub commit failed.",
      },
      { status: 500 }
    );
  }
}
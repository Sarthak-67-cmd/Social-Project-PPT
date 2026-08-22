"use client";

import { useEffect, useState } from "react";

type MemberStats = {
  Sarthak: number;
  Srihita: number;
  Charvik: number;
};

type Update = {
  sha: string;
  person: string;
  message: string;
  date: string | null;
};

type GitHubStats = {
  members: MemberStats;
  total: number;
  updates: Update[];
};

const members = [
  {
    name: "Sarthak",
    color: "bg-green-500",
  },
  {
    name: "Srihita",
    color: "bg-purple-500",
  },
  {
    name: "Charvik",
    color: "bg-blue-500",
  },
];

const CANVA_LINK =
  "https://canva.link/y0mfwcyz37p6tv9";

const NEW_WEBSITE_LINK =
  "https://www.canva.com/design/DAHS_Cb9nw4/c801hi8IKpiKBKUdkCvUHA/edit";

export default function Home() {
  const [showCommit, setShowCommit] = useState(false);

  const [stats, setStats] =
    useState<GitHubStats | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/github/stats",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load GitHub data"
        );
      }

      setStats(data);
    } catch (error) {
      console.error(
        "Stats error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();

    const interval = setInterval(
      loadStats,
      30_000
    );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      {/* HEADER */}

      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* LOGO / TITLE */}

          <div>
            <h1 className="text-2xl font-bold">
              📊 PPT Tracker
            </h1>

            <p className="text-sm text-gray-400">
              Sarthak · Srihita · Charvik
            </p>
          </div>

          {/* WEBSITE NAVIGATION */}

          <nav className="flex flex-wrap items-center gap-2">
            
            {/* TRACKER */}

            <a
              href="/"
              className="rounded-lg bg-green-600 px-4 py-2 font-medium transition hover:bg-green-500"
            >
              📊 PPT Tracker
            </a>

            {/* SOCIAL STUDIES PPT */}

            <a
              href={CANVA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-purple-600 px-4 py-2 font-medium transition hover:bg-purple-500"
            >
              🎨 Social Studies PPT
            </a>

            {/* NEW WEBSITE */}

            <a
              href={NEW_WEBSITE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-500"
            >
              🌐 New Website
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN */}

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* PROJECT */}

        <section className="mb-8">
          <div className="rounded-xl border border-gray-800 bg-[#161b22] p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  OUR PRESENTATION
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Social Studies Project PPT
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Work together on our Canva
                  presentation and track every
                  update with GitHub.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />

                <span className="text-green-400">
                  GitHub Connected
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* CANVA CARD */}

        <section className="mb-8">
          <div className="rounded-xl border border-purple-900/50 bg-[#161b22] p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-2xl">
                  🎨
                </div>

                <div>
                  <h2 className="font-semibold">
                    Social Studies Presentation
                  </h2>

                  <p className="text-sm text-gray-500">
                    Our Canva presentation
                  </p>
                </div>

              </div>

              <a
                href={CANVA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-purple-600 px-5 py-2.5 text-center font-medium transition hover:bg-purple-500"
              >
                Open Presentation →
              </a>

            </div>
          </div>
        </section>

        {/* MEMBERS */}

        <section className="mb-8 grid gap-4 md:grid-cols-3">

          {members.map((member) => {

            const count =
              stats?.members[
                member.name as keyof MemberStats
              ] ?? 0;

            return (
              <div
                key={member.name}
                className="rounded-xl border border-gray-800 bg-[#161b22] p-5"
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`h-4 w-4 rounded-full ${member.color}`}
                  />

                  <h3 className="font-semibold">
                    {member.name}
                  </h3>

                </div>

                <p className="mt-4 text-3xl font-bold">
                  {loading ? "..." : count}
                </p>

                <p className="text-sm text-gray-500">
                  {count === 1
                    ? "commit"
                    : "commits"}
                </p>

              </div>
            );
          })}

        </section>

        {/* CONTRIBUTION GRAPH */}

        <section className="mb-8 rounded-xl border border-gray-800 bg-[#161b22] p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Contributions
              </h2>

              <p className="text-sm text-gray-500">
                {stats?.total ?? 0} total GitHub commits
              </p>
            </div>

          </div>

          <ContributionGraph
            updates={stats?.updates ?? []}
          />

          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">

            <span>Less</span>

            <span className="h-3 w-3 rounded-sm bg-[#21262d]" />
            <span className="h-3 w-3 rounded-sm bg-green-900" />
            <span className="h-3 w-3 rounded-sm bg-green-700" />
            <span className="h-3 w-3 rounded-sm bg-green-500" />
            <span className="h-3 w-3 rounded-sm bg-green-400" />

            <span>More</span>

          </div>

        </section>

        {/* RECENT UPDATES */}

        <section className="rounded-xl border border-gray-800 bg-[#161b22] p-6">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Recent Updates
              </h2>

              <p className="text-sm text-gray-500">
                Live from GitHub
              </p>
            </div>

            <button
              onClick={() =>
                setShowCommit(true)
              }
              className="rounded-lg bg-green-600 px-4 py-2 font-medium transition hover:bg-green-500"
            >
              + Create Commit
            </button>

          </div>

          {loading ? (

            <div className="py-10 text-center text-gray-500">
              Loading GitHub activity...
            </div>

          ) : (stats?.updates?.length ?? 0) === 0 ? (

            <div className="rounded-lg border border-dashed border-gray-700 py-10 text-center">

              <div className="text-3xl">
                📭
              </div>

              <p className="mt-3 font-medium">
                No commits yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create your first update.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {stats?.updates?.map(
                (update) => (

                  <div
                    key={update.sha}
                    className="flex gap-4 border-b border-gray-800 pb-5 last:border-0"
                  >

                    <div
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                        update.person ===
                        "Sarthak"
                          ? "bg-green-500"
                          : update.person ===
                            "Srihita"
                          ? "bg-purple-500"
                          : update.person ===
                            "Charvik"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    />

                    <div className="min-w-0">

                      <p className="font-semibold">
                        {update.person}
                      </p>

                      <p className="text-gray-300">
                        {update.message}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(
                          update.date
                        )}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </section>

      </div>

      {/* COMMIT MODAL */}

      {showCommit && (
        <CommitModal
          onClose={() => {
            setShowCommit(false);
            loadStats();
          }}
        />
      )}

    </main>
  );
}

/* CONTRIBUTION GRAPH */

function ContributionGraph({
  updates,
}: {
  updates: Update[];
}) {
  const today = new Date();

  const days = Array.from(
    { length: 364 },
    (_, index) => {

      const date = new Date(today);

      date.setDate(
        today.getDate() -
          (363 - index)
      );

      return date;
    }
  );

  const counts: Record<
    string,
    number
  > = {};

  updates.forEach((update) => {

    if (!update.date) return;

    const date = new Date(
      update.date
    );

    const key =
      date
        .toISOString()
        .split("T")[0];

    counts[key] =
      (counts[key] || 0) + 1;
  });

  return (
    <div className="overflow-x-auto">

      <div className="flex min-w-[900px] gap-1">

        {days.map((date) => {

          const key =
            date
              .toISOString()
              .split("T")[0];

          const count =
            counts[key] || 0;

          let level =
            "bg-[#21262d]";

          if (count === 1) {
            level = "bg-green-900";
          } else if (count === 2) {
            level = "bg-green-700";
          } else if (count >= 3) {
            level = "bg-green-500";
          }

          return (
            <div
              key={key}
              title={`${count} commit${
                count === 1
                  ? ""
                  : "s"
              } · ${key}`}
              className={`h-4 w-4 shrink-0 rounded-sm ${level}`}
            />
          );
        })}

      </div>

    </div>
  );
}

/* COMMIT MODAL */

function CommitModal({
  onClose,
}: {
  onClose: () => void;
}) {

  const [person, setPerson] =
    useState("Sarthak");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function createCommit() {

    setError("");
    setSuccess("");

    if (!message.trim()) {

      setError(
        "Please enter what you changed."
      );

      return;
    }

    setLoading(true);

    try {

      const response =
        await fetch(
          "/api/github/commit",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              person,
              message:
                message.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
            "Failed to create GitHub commit."
        );
      }

      setSuccess(
        "Commit created successfully! 🎉"
      );

      setMessage("");

      setTimeout(() => {

        onClose();

        window.location.reload();

      }, 1000);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-[#161b22] p-6 shadow-2xl">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Create Commit
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-xl text-gray-500 hover:text-white"
          >
            ×
          </button>

        </div>

        <label className="mb-2 block text-sm font-medium text-gray-400">
          Who made the update?
        </label>

        <select
          value={person}
          onChange={(event) =>
            setPerson(
              event.target.value
            )
          }
          disabled={loading}
          className="mb-5 w-full rounded-lg border border-gray-700 bg-[#0d1117] p-3 text-white outline-none focus:border-green-500"
        >
          <option>
            Sarthak
          </option>

          <option>
            Srihita
          </option>

          <option>
            Charvik
          </option>
        </select>

        <label className="mb-2 block text-sm font-medium text-gray-400">
          What did you update?
        </label>

        <textarea
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          disabled={loading}
          placeholder="Example: Added introduction slides"
          rows={4}
          className="mb-4 w-full resize-none rounded-lg border border-gray-700 bg-[#0d1117] p-3 text-white outline-none placeholder:text-gray-600 focus:border-green-500"
        />

        {error && (
          <div className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-300">
            ✅ {success}
          </div>
        )}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={createCommit}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 font-medium transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Commit"}
          </button>

        </div>

      </div>

    </div>
  );
}

/* DATE FORMATTER */

function formatDate(
  date: string | null
) {

  if (!date)
    return "Unknown time";

  const d = new Date(date);

  return d.toLocaleString(
    [],
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}
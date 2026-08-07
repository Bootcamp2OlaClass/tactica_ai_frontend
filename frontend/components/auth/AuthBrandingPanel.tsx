import Image from "next/image";
import Link from "next/link";

const calendarDays = [
  "28",
  "29",
  "30",
  "31",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];

function DeadlineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 3V7M16 3V7M4 9H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8.5 14L11 16.5L15.5 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M7 7H17L14.5 4.5M17 17H7L9.5 19.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 7C19.2 8.3 20.5 10.6 20.5 13M7 17C4.8 15.7 3.5 13.4 3.5 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CoursesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M6.5 5.5H18A1.5 1.5 0 0 1 19.5 7V18A1.5 1.5 0 0 1 18 19.5H6.5A2.5 2.5 0 0 1 4 17V8A2.5 2.5 0 0 1 6.5 5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M7.5 3.5V17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M10.5 9H16M10.5 12H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UpcomingDeadlineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="4.5"
        y="5.5"
        width="15"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 3.5V7M16 3.5V7M4.5 9H19.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M11.5 13.5H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14.5 11L17 13.5L14.5 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AuthBrandingPanel() {
  return (
    <aside
      className="relative hidden min-h-screen overflow-hidden border-r border-[#dedee9] bg-[#f6f4ff] px-8 py-7 text-[#17171c] lg:flex lg:flex-col xl:px-12 xl:py-9"
      aria-labelledby="auth-branding-heading"
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-24 bottom-12 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl"
        aria-hidden="true"
      />

      {/* Brand */}
      <Link
        href="/"
        className="relative z-10 inline-flex w-fit items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f4ff]"
        aria-label="Tactica AI home"
      >
        <Image
          src="/penguin/penguin-advisor.png"
          alt=""
          width={44}
          height={44}
          className="object-contain"
          aria-hidden="true"
          
        />

        <span>
          <span className="block text-base font-semibold tracking-[-0.02em]">
            Tactica AI
          </span>

          <span className="mt-0.5 block text-xs font-normal text-[#696977]">
            Your smarter Canvas.
          </span>
        </span>
      </Link>

      <div className="relative z-10 my-auto py-8">
        {/* Product message */}
        <header className="mb-6 max-w-2xl">
          <h1
            id="auth-branding-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] xl:text-5xl"
          >
            Everything for your academic life.
          </h1>

          <p className="mt-4 max-w-xl text-sm font-normal leading-6 text-[#696977] xl:text-base xl:leading-7">
            Courses, deadlines, notes, study plans, and AI guidance—all
            organized in one intelligent workspace.
          </p>
        </header>

        {/* Dashboard preview */}
        <section
          className="rounded-[1.75rem] border border-[#dedee9] bg-white p-4 shadow-[0_20px_50px_rgba(49,58,120,0.10)]"
          aria-label="Tactica AI dashboard preview"
        >
          <div className="grid grid-cols-12 gap-3">
            {/* Semester card */}
            <article className="relative col-span-8 min-h-40 overflow-hidden rounded-2xl border border-[#dedee9] bg-white p-5">
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#dce4ff]"
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                    Fall 2026
                  </h2>

                  <p className="mt-2 text-sm font-normal text-[#696977]">
                    Computer Science, B.S.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="rounded-lg bg-[#315bd8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2"
                  >
                    View study plan
                  </button>
                </div>
              </div>
            </article>

            {/* AI advisor */}
            <article className="col-span-4 min-h-40 rounded-2xl border border-[#dedee9] bg-white p-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-base text-[#315bd8]"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <p className="text-xs font-semibold text-[#315bd8]">
                  Penguin Advisor
                </p>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <Image
                  src="/penguin/penguin-advisor.png"
                  alt=""
                  width={44}
                  height={44}
                  className="shrink-0 object-contain"
                  aria-hidden="true"
                />

                <p className="text-xs font-normal leading-5 text-[#454550]">
                  Start your Database Project today. You have a lighter load
                  this week.
                </p>
              </div>
            </article>

            {/* Active courses */}
            <article className="col-span-4 rounded-2xl border border-[#dedee9] bg-white p-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef2ff] text-[#315bd8]"
                aria-hidden="true"
              >
                <CoursesIcon />
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                4
              </p>

              <p className="mt-1 text-xs font-medium text-[#696977]">
                Active courses
              </p>
            </article>

            {/* Upcoming deadlines */}
            <article className="col-span-4 rounded-2xl border border-[#dedee9] bg-white p-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef2ff] text-[#315bd8]"
                aria-hidden="true"
              >
                <UpcomingDeadlineIcon />
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                12
              </p>

              <p className="mt-1 text-xs font-medium text-[#696977]">
                Upcoming deadlines
              </p>
            </article>

            {/* Calendar */}
            <article className="col-span-4 rounded-2xl border border-[#dedee9] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">November</p>

                <span
                  className="text-xs text-[#696977]"
                  aria-hidden="true"
                >
                  ‹ ›
                </span>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-[9px] font-medium text-[#696977]">
                {["M", "T", "W", "T", "F", "S", "S"].map(
                  (day, index) => (
                    <span key={`${day}-${index}`}>
                      {day}
                    </span>
                  ),
                )}

                {calendarDays.map((day) => (
                  <span
                    key={day}
                    className={
                      day === "7"
                        ? "mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#315bd8] text-white"
                        : "flex h-5 items-center justify-center"
                    }
                  >
                    {day}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* Product highlights */}
        <section
          className="mt-5 grid grid-cols-3 gap-3"
          aria-label="Tactica AI product highlights"
        >
          <article className="rounded-2xl border border-transparent p-4 transition hover:-translate-y-0.5 hover:border-[#dedee9] hover:bg-white hover:shadow-sm">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-[#315bd8]"
              aria-hidden="true"
            >
              <DeadlineIcon />
            </span>

            <h2 className="mt-3 text-sm font-semibold leading-5 text-[#17171c]">
              Never miss a deadline
            </h2>

            <p className="mt-1 text-xs font-normal leading-5 text-[#696977]">
              Smart reminders before exams and assignments.
            </p>
          </article>

          <article className="rounded-2xl border border-transparent p-4 transition hover:-translate-y-0.5 hover:border-[#dedee9] hover:bg-white hover:shadow-sm">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-[#315bd8]"
              aria-hidden="true"
            >
              <SyncIcon />
            </span>

            <h2 className="mt-3 text-sm font-semibold leading-5 text-[#17171c]">
              Connected to Canvas
            </h2>

            <p className="mt-1 text-xs font-normal leading-5 text-[#696977]">
              Courses and deadlines, automatically synced.
            </p>
          </article>

          <article className="rounded-2xl border border-transparent p-4 transition hover:-translate-y-0.5 hover:border-[#dedee9] hover:bg-white hover:shadow-sm">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff]"
              aria-hidden="true"
            >
              <Image
                src="/penguin/penguin-advisor.png"
                alt=""
                width={32}
                height={32}
                className="object-contain"
                aria-hidden="true"
              />
            </span>

            <h2 className="mt-3 text-sm font-semibold leading-5 text-[#17171c]">
              AI Academic Advisor
            </h2>

            <p className="mt-1 text-xs font-normal leading-5 text-[#696977]">
              Prioritize what matters most, every day.
            </p>
          </article>
        </section>
      </div>
    </aside>
  );
}
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <section aria-labelledby="login-heading">
      <header className="mb-8 text-center">
        <Image
          src="/penguin/penguin-advisor.png"
          alt=""
          width={112}
          height={112}
          className="mx-auto h-28 w-28 object-contain"
          aria-hidden="true"
          priority
        />

        <h1
          id="login-heading"
          className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#17171c]"
        >
          Welcome back
        </h1>

        <p className="mt-2 text-sm font-normal leading-6 text-[#696977]">
          Sign in to your account to continue.
        </p>
      </header>

      <form className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-[#34343c]"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            required
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#34343c]"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="rounded text-xs font-medium text-[#315bd8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2 active:translate-y-0"
        >
          Sign in
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="mt-7 text-center text-sm font-normal text-[#696977]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="rounded font-semibold text-[#315bd8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          Register
        </Link>
      </p>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <section aria-labelledby="register-heading">
      <header className="mb-8 text-center">
        <Image
          src="/penguin/penguin-advisor.png"
          alt=""
          width={96}
          height={96}
          className="mx-auto h-24 w-24 object-contain"
          aria-hidden="true"
          priority
        />

        <h1
          id="register-heading"
          className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#17171c]"
        >
          Create your account
        </h1>

        <p className="mt-2 text-sm font-normal leading-6 text-[#696977]">
          Start organizing your academic life in one intelligent workspace.
        </p>
      </header>

      <form className="space-y-5">
        <div>
          <label
            htmlFor="full-name"
            className="block text-xs font-medium text-[#34343c]"
          >
            Full name
          </label>

          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Nhi Nguyen"
            required
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-medium text-[#34343c]"
          >
            Email address
          </label>

          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            required
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-medium text-[#34343c]"
          >
            Password
          </label>

          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a secure password"
            required
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2 active:translate-y-0"
        >
          Create account
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="mt-7 text-center text-sm font-normal text-[#696977]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="rounded font-semibold text-[#315bd8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
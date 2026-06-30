import Link from "next/link";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

type PageShellProps = {
  children: React.ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-[#f6efe6] pt-[108px] text-[#191817] max-[900px]:pt-[92px] max-[640px]:pt-[82px]">
      <Navbar />
      {children}
      <section
        className="border-t border-[#d9cec1] bg-[#f6efe6] px-6 py-[clamp(64px,8vw,96px)] max-[640px]:px-4"
        aria-labelledby="signup-title"
      >
        <div className="mx-auto grid w-[min(100%,920px)] justify-items-center text-center">
          <h2
            className="font-fraunces text-[clamp(1.8rem,3vw,2.55rem)] font-medium leading-[1.15] tracking-normal"
            id="signup-title"
          >
            Want Updates on What&apos;s New at Tejaswi Blog?
          </h2>
          <NewsletterSignup />
        </div>
      </section>
      <footer className="border-t border-[#d9cec1] bg-[#f1e8dc] px-6 py-12 max-[640px]:px-4">
        <div className="mx-auto flex w-[min(100%,1250px)] items-center justify-between gap-6 max-[700px]:flex-col max-[700px]:items-start">
          <p className="font-fraunces text-2xl font-medium">Tejaswi</p>
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-[0.92rem] font-bold text-[#5f594f]"
            aria-label="Footer"
          >
            <Link className="hover:text-[#191817]" href="/">
              Home
            </Link>
            <Link className="hover:text-[#191817]" href="/blog">
              Blog
            </Link>
            <Link className="hover:text-[#191817]" href="/series">
              Series
            </Link>
            <Link className="hover:text-[#191817]" href="/search">
              Search
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

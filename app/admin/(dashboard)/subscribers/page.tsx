import { prisma } from "@/lib/prisma";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
        Subscribers
      </p>
      <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
        Newsletter
      </h1>
      <div className="mt-10 divide-y divide-[#d9cec1] border border-[#d9cec1] bg-[#fffaf2]">
        {subscribers.map((subscriber) => (
          <article
            className="grid grid-cols-[1fr_auto] gap-4 p-5 max-[640px]:grid-cols-1"
            key={subscriber.id}
          >
            <div>
              <h2 className="font-fraunces text-3xl font-medium">
                {subscriber.name || "Unnamed reader"}
              </h2>
              <p className="mt-2 text-base font-semibold text-[#625c52]">
                {subscriber.email}
              </p>
            </div>
            <p className="self-center text-sm font-black uppercase tracking-[0.14em] text-[#717a51]">
              {subscriber.active ? "Active" : "Inactive"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";

export default function Pricing() {
  return (
    <>
      <section>
        <p>This is for Pricing Page</p>
        <p>more coming soon visit dashboard</p>
        <Link href="/dashboard">Go to Dashboard</Link>

        <p>
          if new user please <Link href="/auth"> singin</Link>
        </p>
      </section>
    </>
  );
}

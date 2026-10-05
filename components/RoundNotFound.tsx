import Link from "next/link";

export function RoundNotFound() {
  return (
    <section className="section">
      <div className="panel">
        <h2>Round not found</h2>
        <p className="muted">This round is not saved on this device. It may have been cleared or recorded elsewhere.</p>
        <Link className="button primary" href="/">
          Back home
        </Link>
      </div>
    </section>
  );
}

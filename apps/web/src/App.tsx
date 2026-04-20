const markets = ["Makurdi", "Gboko", "Zaki Biam", "Otukpo"];
const commodities = [
  "Yam",
  "Cassava",
  "Rice",
  "Maize",
  "Beans",
  "Soybean",
  "Millet",
  "Sorghum",
];

export default function App() {
  return (
    <main className="app-shell">
      <div className="background-grid" />
      <section className="hero-card">
        <p className="eyebrow">BAPI - Benue AgriPrice Insight</p>
        <h1>Phase 4 local environment bootstrap is ready.</h1>
        <p className="lead">
          The frontend, backend, database orchestration, and ML service now have
          a shared local setup foundation for later implementation phases.
        </p>
        <div className="info-grid">
          <article>
            <h2>Markets</h2>
            <ul>
              {markets.map((market) => (
                <li key={market}>{market}</li>
              ))}
            </ul>
          </article>
          <article>
            <h2>Commodities</h2>
            <ul>
              {commodities.map((commodity) => (
                <li key={commodity}>{commodity}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

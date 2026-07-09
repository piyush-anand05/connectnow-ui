import { Sparkles, Search } from "lucide-react";

export default function AISearchCard({ value, onChange, placeholder }) {
  return (
    <section className="home-ai-orb-section">
      <div className="home-ai-orb-wrap" aria-hidden="true">
        <div className="home-ai-orb">
          <span className="home-ai-orb-core" />
          <span className="home-ai-particle home-ai-particle-one" />
          <span className="home-ai-particle home-ai-particle-two" />
          <span className="home-ai-particle home-ai-particle-three" />
        </div>
      </div>

      <div className="home-ai-orb-copy">
        <div className="home-ai-label"><Sparkles size={16} /> Smart local matching preview</div>
        <h2>Ask ConnectNowww AI</h2>
        <p>
          Describe what you need locally — a tutor, repair help, sports partner, donor, event, mentor, gig or home-made food. The AI layer will explore your locality and suggest the next useful action.
        </p>

        <label className="home-ai-orb-search">
          <Search size={20} />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        </label>
      </div>
    </section>
  );
}

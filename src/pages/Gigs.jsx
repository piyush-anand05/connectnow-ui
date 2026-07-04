import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/home.css";

export default function Gigs() {
  return (
    <div className="home-page">
      <div className="animated-bg"></div>
      <Sidebar active="gigs" />

      <main className="main-content">
        <Topbar
          title="Gig Marketplace"
          subtitle="Create and discover paid local opportunities"
        />

        <div className="ai-card">
          <h2>Gig Marketplace page coming next</h2>
        </div>
      </main>
    </div>
  );
}
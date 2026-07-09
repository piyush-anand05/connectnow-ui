const chips = [
  "Tutor", "Home baker", "Cricket", "Repair help", "Book club", "Weekend singer", "Blood donor", "Startup mentor", "Yoga class", "Old books", "Carpool", "Photography walk",
];

export default function DiscoveryChips() {
  return (
    <section className="home-discovery-chips-section">
      <div>
        <p className="cn-page-kicker">What you can discover</p>
        <h2>Hidden local value around you</h2>
        <p>People, opportunities and communities that usually stay invisible inside chats, notice boards and word of mouth.</p>
      </div>
      <div className="home-discovery-chip-cloud">
        {chips.map((chip, index) => (
          <span key={chip} style={{ "--chip-delay": `${index * 0.12}s` }}>{chip}</span>
        ))}
      </div>
    </section>
  );
}

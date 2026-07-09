import { SlidersHorizontal } from "lucide-react";

export default function HomeFilters({
  categories,
  selectedCategory,
  dateFilter,
  feeFilter,
  onCategoryChange,
  onDateFilterChange,
  onFeeFilterChange,
}) {
  const dateOptions = ["All", "Today", "Tomorrow", "This Week"];
  const feeOptions = ["All", "Free", "Paid"];

  return (
    <section className="home-filter-ribbon">
      <div className="home-filter-title">
        <SlidersHorizontal size={18} />
        <span>Refine local signals</span>
      </div>

      <div className="home-filter-chip-row">
        {categories.slice(0, 8).map((category) => (
          <button key={category} type="button" className={selectedCategory === category ? "home-filter-chip home-filter-chip-active" : "home-filter-chip"} onClick={() => onCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>

      <div className="home-filter-grid">
        <select className="cn-select" value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select className="cn-select" value={dateFilter} onChange={(event) => onDateFilterChange(event.target.value)}>
          {dateOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All Dates" : item}</option>)}
        </select>
        <select className="cn-select" value={feeFilter} onChange={(event) => onFeeFilterChange(event.target.value)}>
          {feeOptions.map((item) => <option key={item} value={item}>{item === "All" ? "Free + Paid" : item}</option>)}
        </select>
      </div>
    </section>
  );
}

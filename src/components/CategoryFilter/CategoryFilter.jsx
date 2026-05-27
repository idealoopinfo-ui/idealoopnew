import "./CategoryFilter.css";

export default function CategoryFilter({
  categories = [],
  setSelected,
  selected,
}) {
  return (
    <div className="cat-container">

      {/* ALL BUTTON */}
      <button
        className={selected === null ? "active" : ""}
        onClick={() => setSelected(null)}
      >
        All
      </button>

      {/* CATEGORY BUTTONS */}
      {categories?.map((cat) => (
        <button
          key={cat.id || cat.name}
          className={selected === cat.id ? "active" : ""}
          onClick={() => setSelected(cat.id)}
        >
          {cat.name}
        </button>
      ))}

    </div>
  );
}
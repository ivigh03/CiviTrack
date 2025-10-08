export default function Filters({ filters, setFilters }) {
  return (
    <div className="filters">
      <select
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value })
        }
      >
        <option value="">All Types</option>
        <option value="road">Road</option>
        <option value="water">Water</option>
        <option value="garbage">Garbage</option>
      </select>

      <input
        type="text"
        placeholder="Search Area"
        onChange={(e) =>
          setFilters({ ...filters, area: e.target.value })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setFilters({ ...filters, date: e.target.value })
        }
      />
    </div>
  );
}
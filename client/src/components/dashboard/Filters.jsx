import Select from "../ui/Select";
import Input from "../ui/Input";

export default function Filters({ filters, setFilters }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="road">Road</option>
        <option value="water">Water</option>
        <option value="garbage">Garbage</option>
      </Select>

      <Input
        type="text"
        placeholder="Search area..."
        value={filters.area}
        onChange={(e) => setFilters({ ...filters, area: e.target.value })}
      />

      <Input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
    </div>
  );
}

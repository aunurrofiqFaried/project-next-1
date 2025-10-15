'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface FilterOptions {
  types: string[];
  severities: string[];
  statuses: string[];
}

interface Filters {
  startDate: string;
  endDate: string;
  status: string;
  severity: string;
  violationType: string;
}

interface PelanggaranFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  filters: Filters;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  filterOptions: FilterOptions;
  filteredCount: number;
  totalCount: number;
}

const PelanggaranFilters = ({
  showFilters,
  setShowFilters,
  search,
  setSearch,
  filters,
  onFilterChange,
  onClearFilters,
  filterOptions,
  filteredCount,
  totalCount
}: PelanggaranFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Header with search and filter controls */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-1 items-center gap-2">
          <div className="text-xs text-gray-600 ml-2">
            <span className="font-medium text-blue-600">{filteredCount}</span> dari {totalCount} data
          </div>
        </div>
      </div>

      {/* Collapsible Filter Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Tanggal Mulai</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange("startDate", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Tanggal Selesai</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange("endDate", e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Status</Label>
              <Select 
                value={filters.status || "all"} 
                onValueChange={(v) => onFilterChange("status", v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {filterOptions.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Tingkat</Label>
              <Select 
                value={filters.severity || "all"} 
                onValueChange={(v) => onFilterChange("severity", v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Semua Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tingkat</SelectItem>
                  {filterOptions.severities.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Jenis Pelanggaran</Label>
              <Select 
                value={filters.violationType || "all"} 
                onValueChange={(v) => onFilterChange("violationType", v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Semua Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {filterOptions.types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PelanggaranFilters;
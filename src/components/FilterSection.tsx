
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface FilterSectionProps {
  onFilterChange: (category: string, priceRange: string) => void;
  categories: string[];
  activeFilters: { category: string; priceRange: string };
}

const FilterSection = ({ onFilterChange, categories, activeFilters }: FilterSectionProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const priceRanges = [
    { value: "all", label: "Tous les prix" },
    { value: "0-5000", label: "0 - 5,000 DA" },
    { value: "5000-10000", label: "5,000 - 10,000 DA" },
    { value: "10000-20000", label: "10,000 - 20,000 DA" },
    { value: "20000+", label: "20,000+ DA" },
  ];

  const clearFilters = () => {
    onFilterChange("all", "all");
  };

  const hasActiveFilters = activeFilters.category !== "all" || activeFilters.priceRange !== "all";

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gold-border flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gold-300 hover:text-gold-200 flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Effacer les filtres
          </Button>
        )}

        {activeFilters.category !== "all" && (
          <Badge variant="outline" className="border-gold-500/30 text-gold-300">
            Catégorie: {activeFilters.category}
          </Badge>
        )}

        {activeFilters.priceRange !== "all" && (
          <Badge variant="outline" className="border-gold-500/30 text-gold-300">
            Prix: {priceRanges.find(p => p.value === activeFilters.priceRange)?.label}
          </Badge>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gold-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">
                Catégorie
              </label>
              <Select
                value={activeFilters.category}
                onValueChange={(value) => onFilterChange(value, activeFilters.priceRange)}
              >
                <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gold-500/30 text-white">
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">
                Gamme de prix
              </label>
              <Select
                value={activeFilters.priceRange}
                onValueChange={(value) => onFilterChange(activeFilters.category, value)}
              >
                <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gold-500/30 text-white">
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
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

export default FilterSection;

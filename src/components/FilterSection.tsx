
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useApp } from '@/contexts/AppContext';

interface FilterSectionProps {
  onFilterChange: (category: string, priceRange: string) => void;
  categories: string[];
  activeFilters: { category: string; priceRange: string };
}

const FilterSection = ({ onFilterChange, categories, activeFilters }: FilterSectionProps) => {
  const { t } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const priceRanges = [
    { value: "all", label: t('all_prices') },
    { value: "0-5000", label: t('price_range_1') },
    { value: "5000-10000", label: t('price_range_2') },
    { value: "10000-20000", label: t('price_range_3') },
    { value: "20000+", label: t('price_range_4') },
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
          {t('filters')}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gold-300 hover:text-gold-200 flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            {t('clear_filters')}
          </Button>
        )}

        {activeFilters.category !== "all" && (
          <Badge variant="outline" className="border-gold-500/30 text-gold-300">
            {t('category')}: {activeFilters.category}
          </Badge>
        )}

        {activeFilters.priceRange !== "all" && (
          <Badge variant="outline" className="border-gold-500/30 text-gold-300">
            {t('price')}: {priceRanges.find(p => p.value === activeFilters.priceRange)?.label}
          </Badge>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gold-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gold-300 mb-2">
                {t('category')}
              </label>
              <Select
                value={activeFilters.category}
                onValueChange={(value) => onFilterChange(value, activeFilters.priceRange)}
              >
                <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gold-500/30 text-white">
                  <SelectItem value="all">{t('all_categories')}</SelectItem>
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
                {t('price_range')}
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

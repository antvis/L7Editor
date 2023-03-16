import { FilterNode } from './../types/filter';
import { useState } from 'react';

export default () => {
  const [filters, setFilters] = useState<FilterNode[]>([]);
  return {
    filters,
    setFilters,
  };
};

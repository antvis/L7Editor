import { FilterNode } from './../types/filter';
import { useState } from 'react';

export default () => {
  const [filter, setFilter] = useState<FilterNode[]>([])
  return {
    filter,
    setFilter
  }
}

import { FilterNode } from './../types/filter';
import { useState } from 'react';
import { uniqueId } from 'lodash';

const mockFilters: FilterNode[] = [
  {
    type: 'number',
    id: uniqueId(),
    field: 'adcode',
    logic: 'and',
    operator: 'BETWEEN',
    value: [200000, 400000]
  },
  {
    type: 'number',
    id: uniqueId(),
    field: 'childrenNum',
    logic: 'and',
    operator: '=',
    value: 13
  },
  {
    type: 'string',
    id: uniqueId(),
    field: 'name',
    logic: 'or',
    operator: 'LIKE',
    value: '江'
  },
]

export default () => {
  const [filter,setFilter] = useState<FilterNode[]>([])
  return{
    filter,
    setFilter
  }
}
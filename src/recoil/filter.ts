import { atom, useRecoilState } from 'recoil';
import { FilterNode } from './../types/filter';

export default function useFilter() {
  const [filters, setFilters] = useRecoilState(
    atom<FilterNode[]>({
      key: 'filter',
      default: [],
    }),
  );

  return {
    filters,
    setFilters,
  };
}

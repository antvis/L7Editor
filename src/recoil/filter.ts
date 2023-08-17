import { useRecoilState } from 'recoil';
import { filterState } from './atomState';

export default function useFilter() {
  const [filters, setFilters] = useRecoilState(filterState);

  return {
    filters,
    setFilters,
  };
}

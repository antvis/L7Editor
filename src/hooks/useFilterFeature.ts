import { Feature, Geometry, GeometryCollection } from '@turf/turf';
import { isEmpty, isUndefined } from 'lodash';
import { useEffect } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { useFeature, useFilter } from '../recoil';
import { FilterNode } from './../types/filter';

export function isEmptyFilter(filter: FilterNode) {
  const { operator, value, type, field } = filter;
  return (
    isUndefined(operator) ||
    isUndefined(value) ||
    isUndefined(type) ||
    isUndefined(field) ||
    value === '' ||
    Number.isNaN(value as number) ||
    value === null
  );
}

function numberFilter(filter: FilterNode, properties: Record<string, any>) {
  const newField = properties[filter.field];
  switch (filter.operator) {
    case '<':
      return newField < filter.value;
    case '<=':
      return newField <= filter.value;
    case '=':
      return newField === filter.value;
    case '>':
      return newField > filter.value;
    case '>=':
      return newField >= filter.value;
    default:
      if (Array.isArray(filter.value)) {
        const [value1, value2] = filter.value;
        return newField >= value1 && newField <= value2;
      }
  }
}

function stringFilter(filter: FilterNode, properties: Record<string, any>) {
  const newField = String(properties[filter.field]);
  const value = filter.value as string;
  switch (filter.operator) {
    case 'NOT_IN':
      return !value?.includes(newField);
    case 'IN':
      return value?.includes(newField);
    case 'LIKE':
      return newField?.indexOf(value) > -1;
    default:
      return newField?.indexOf(value) <= -1;
  }
}

export type Features = Feature<
  Geometry | GeometryCollection,
  Record<string, any>
>;

export const filterFeatures = atom<Features[]>({
  key: 'filterFeature',
  default: [],
});

export function useFilterFeature() {
  const { features } = useFeature();
  const { filters: newFilters } = useFilter();

  const setFilterFeature = useSetRecoilState(filterFeatures);
  const filterFeature = useRecoilValue(filterFeatures);

  useEffect(() => {
    if (isEmpty(newFilters)) {
      setFilterFeature([...features]);
      return;
    }
    let newFeature = [...features];
    // 过滤空值
    const setNotEmptyFilter = newFilters.filter((a) => !isEmptyFilter(a));
    // 查找 and 条件 且
    const andFilters = setNotEmptyFilter.filter((item) => item.logic === 'and');
    // 查找 or 条件 或
    const orFilters = setNotEmptyFilter.filter((item) => item.logic === 'or');

    if (!isEmpty(orFilters)) {
      newFeature = newFeature.filter(({ properties }) => {
        return orFilters.some((filter) => {
          const func = filter.type === 'number' ? numberFilter : stringFilter;
          return func(filter, properties);
        });
      });
    }
    if (!isEmpty(andFilters)) {
      newFeature = newFeature.filter(({ properties }) => {
        return andFilters.every((filter) => {
          const func = filter.type === 'number' ? numberFilter : stringFilter;
          return func(filter, properties);
        });
      });
    }
    setFilterFeature(newFeature);
  }, [features, newFilters, setFilterFeature]);

  return {
    newFeatures: filterFeature,
  };
}

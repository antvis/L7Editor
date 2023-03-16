import { Feature, Geometry, GeometryCollection } from '@turf/turf';
import { useState, useEffect } from 'react';
import { FilterNode } from './../types/filter';
import { useModel } from 'umi';
import { isEmpty, isUndefined } from 'lodash';

export function isEmptyFilter(filter: FilterNode) {
  const { operator, value, type, field } = filter;
  console.log(filter, 'filter');
  return (
    isUndefined(operator) ||
    isUndefined(value) ||
    isUndefined(type) ||
    isUndefined(field) ||
    value === '' ||
    !isNaN(value as number)
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

type Features = Feature<Geometry | GeometryCollection, {}>;
export function useFilterFeature() {
  const { features } = useModel('feature');
  const { filters: newFilters } = useModel('filter');
  const [newFeatures, setNewFeatures] = useState<Features[]>([]);

  useEffect(() => {
    if (isEmpty(newFilters)) {
      setNewFeatures(features);
      return;
    }
    let newFeature = features;
    // 过滤空值
    const setnotEmptyFilter = newFilters.filter((a) => !isEmptyFilter(a));
    console.log(setnotEmptyFilter, 'isEmptyFilter');
    // 查找 and 条件 且
    const andFilters = setnotEmptyFilter.filter((item) => item.logic === 'and');
    // 查找 or 条件 或
    const orFilters = setnotEmptyFilter.filter((item) => item.logic === 'or');

    if (!isEmpty(orFilters)) {
      newFeature = newFeature.filter(({ properties }) => {
        return orFilters.some((filter) => {
          console.log(filter.type);
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
    setNewFeatures(newFeature);
  }, [features, newFilters]);

  return {
    newFeatures,
    setNewFeatures,
  };
}

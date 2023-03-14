import { Feature, Geometry, GeometryCollection } from '@turf/turf';
import { useState, useEffect } from 'react';
import { FilterNode } from './../types/filter';
import { useModel } from 'umi';
import { isEmpty } from 'lodash';



function numberFilter(filter: FilterNode, properties: Record<string, any>) {
  const newField = properties[filter.field]
  switch (filter.operator) {
    case '<':
      return newField < filter.value
    case '<=':
      return newField <= filter.value
    case '=':
      return newField === filter.value
    case '>':
      return newField > filter.value
    case '>=':
      return newField >= filter.value
    default:
      if (Array.isArray(filter.value)) {
        const [value1, value2] = filter.value
        return newField >= value1 && newField <= value2
      }
  }
}

function stringFilter(filter: FilterNode, properties: Record<string, any>) {
  const newField = properties[filter.field]
  if (typeof filter.value !== 'string') {
    return
  }
  const value = filter.value as string
  switch (filter.operator) {
    case 'IN':
      return newField.includes(value)
    case 'LIKE':
      return newField.indexOf(value) > -1
    default:
      break;
  }
}

type Features = Feature<Geometry | GeometryCollection, {}>
export function useFilterFeature() {
  const { features } = useModel('feature');
  const { filter: newFilters } = useModel('filter')
  const [newFeatures, setNewFeatures] = useState<Features[]>([])

  useEffect(() => {
    if (isEmpty(newFilters)) {
      setNewFeatures(features)
      return
    }
    let newFeature = features
    // 查找 and 条件 且
    const andFilters = newFilters.filter((item) => item.logic === 'and')
    // 查找 or 条件 或
    const orFilters = newFilters.filter((item) => item.logic === 'or')

    if (!isEmpty(orFilters)) {
      newFeature = newFeature.filter(({ properties }) => {
        return orFilters.some((filter) => {
          if (filter.type === 'number') {
            return numberFilter(filter, properties)
          }
          return stringFilter(filter, properties)
        })
      })
    }
    if (!isEmpty(andFilters)) {
      newFeature = newFeature.filter(({ properties }) => {
        return andFilters.every((filter) => {
          if (filter.type === 'number') {
            return numberFilter(filter, properties)
          }
          return stringFilter(filter, properties)
        })
      })
    }
    setNewFeatures(newFeature)
  }, [features, newFilters])

  return {
    newFeatures,
    setNewFeatures
  }
}


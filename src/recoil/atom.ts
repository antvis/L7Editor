import { useLocalStorageState } from 'ahooks';
import { atom } from 'recoil';

interface IDefaultRecoilState {
  stateKey: string;
  storageKey?: string;
  storageValue?: any;
}

export function useDefaultRecoilState<T = any>(params: IDefaultRecoilState) {
  const { stateKey, storageKey, storageValue } = params;
  const [localStorageValue] = useLocalStorageState(storageKey!, {
    defaultValue: storageValue,
  });
  const atomHook = atom<T>({
    key: stateKey,
    default: localStorageValue,
  });
  return atomHook;
}

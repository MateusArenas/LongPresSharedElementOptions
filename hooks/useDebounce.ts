import { useCallback, useEffect, useState } from "react";

export function useDebounceHandler<T extends (...args: any[]) => any>(callback: T, delay: number, immediate?: boolean): T {
	var timeout;
	return function(args) {
    
    var later = function() {
      timeout = null;
			if (!immediate) callback(args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, delay);
		if (callNow) callback(args);
	} as any
};

export function useDebounceEffect(effect: React.EffectCallback, delay: number, deps?: React.DependencyList) {
  // State and setters for debounced value
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        effect();
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [delay].concat(deps) // Only re-call effect if value or delay changes
  );
}

export function useDebounceTypingEffect(effect: React.EffectCallback, delay: number, deps?: React.DependencyList) {
  const [immediate, setImmediate] = useState<boolean>(false)

  function callback () {
      if (!immediate) {
          effect();
          setImmediate(true)
      }
  }

  useEffect(() => {
      useDebounceHandler(callback, delay, !immediate)()
  }, [delay].concat(deps))

  useDebounceEffect(() => {
    setImmediate(false)
  }, delay, [immediate])
}

export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useDebounceEffect(() => {
    setDebouncedValue(value)
  }, delay, [value])

  return debouncedValue;
}

export function useDebounceState<T>(initialValue: T, delay: number) : [T, React.Dispatch<React.SetStateAction<T>>, T]{
  const [value, setValue] = useState<T>(initialValue);
  const debounceValue = useDebounce<T>(value, delay);
  return [value, setValue, debounceValue];
};
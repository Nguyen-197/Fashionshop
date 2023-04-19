import { useState, useEffect } from 'react';
import _ from 'lodash';
import useDebounce from './useDebounce';

export const useDependency = (dependencies, formValue): [boolean] => {
    const [isChange, setIsChange] = useState<boolean>(null);
    const [oldValue, setOldValue] = useState({});
    const debouncedDependency = useDebounce(oldValue, 1000);

    useEffect(() => {
        if (dependencies) {
            setIsChange(false);
        }
    }, []);

    useEffect(() => {
        if (dependencies && isChange !== null && !_.isEqual(debouncedDependency, {})) {
            setIsChange(!isChange);
        }
    }, [debouncedDependency]);

    useEffect(() => {
        if (!dependencies || isChange === null) {
            return;
        }
        const value = {};
        formValue = formValue || {};
        dependencies.forEach(element => {
            value[element] = formValue[element];
        });
        if (!_.isEqual(value, oldValue)) {
            setOldValue(value);
        }
    }, [dependencies, formValue])

    return [isChange];
};

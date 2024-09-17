import { useState } from "react";

export const useFormInput = () => {
    const [value, setValue] = useState('');
    const onChange = (e) => {
        setValue(e.target.value);
    }
    return {
        value,
        setValue,
        onChange
    }
}
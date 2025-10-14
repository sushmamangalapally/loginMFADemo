import { useEffect, useRef } from 'react';
import '../styles/Auth.css';
export default function InputDigit({ value, isFocused, ...props}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (isFocused && inputRef?.current) {
            inputRef?.current?.focus();
        }
    }, [isFocused]);
    return (
        <input
            type="text"
            ref={inputRef}
            maxLength="1"
            className="input-digit-box"
            value={value}
            className={`otp-input ${isFocused ? 'focused' : ''}`}
            {...props}
        />
    )
}
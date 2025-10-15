import { useEffect, useRef } from 'react';
import '../styles/Auth.css';
export default function InputDigit({ value, isFocused, ...props}) {
  /* ---------------- Ref ---------------- */
  const inputRef = useRef(null);

  /* ---------------- Auto focus on input ---------------- */
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
      value={value}
      className='otp-input'
      {...props}
    />
  )
}
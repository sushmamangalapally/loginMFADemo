import { useEffect, useRef } from 'react';
import '../styles/Auth.css';
export default function InputDigit({ index, value, isFocused, ...props}) {
  /* ---------------- Ref ---------------- */
  const inputRef = useRef(null);

  /* ---------------- Auto focus on input ---------------- */
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused, index, value]);

  return (
    <input
      ref={inputRef}
      type="text"
      pattern="[0-9]*"
      maxLength="1"
      value={value}
      name={`otp-${index}`}
      id={`otp-${index}`}
      data-otp-index={index}
      className={ `otp-input ${isFocused ? 'focused' : ''}` }
      {...props}
    />
  )
}
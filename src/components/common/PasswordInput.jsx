import { useState } from 'react'
import './styles/PasswordInput.css'

export default function PasswordInput({ id, className, placeholder, value, onChange, autoComplete, autoFocus }) {
  const [show, setShow] = useState(false)

  return (
    <div className="pwd-input__wrap">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className={`pwd-input__field ${className || ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        className="pwd-input__toggle"
        onClick={() => setShow((p) => !p)}
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          // eye-off
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M10.477 6.535A4 4 0 0 1 14 10c0 .23-.02.454-.059.672M7.21 7.21A4 4 0 0 0 6 10a4 4 0 0 0 5.465 3.755M4.58 4.58C2.977 5.645 1.677 7.173 1 10c1.073 4.267 4.5 7 9 7a10.9 10.9 0 0 0 4.42-.92M8 2.07A10.9 10.9 0 0 1 10 2c4.5 0 7.927 2.733 9 7a10.94 10.94 0 0 1-1.585 3.41"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ) : (
          // eye
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M1 10c1.073-4.267 4.5-7 9-7s7.927 2.733 9 7c-1.073 4.267-4.5 7-9 7s-7.927-2.733-9-7Z"
              stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        )}
      </button>
    </div>
  )
}
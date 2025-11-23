import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

export const Input: React.FC<InputProps> = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  icon, 
  showPasswordToggle, 
  onTogglePassword 
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    pointerEvents: 'none',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: icon ? '40px' : '16px',
    paddingRight: showPasswordToggle ? '40px' : '16px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      {icon && (
        <div style={iconStyle}>
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = '#10B981';
          e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#D1D5DB';
          e.target.style.boxShadow = 'none';
        }}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#6B7280')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
        >
          {type === 'password' ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};
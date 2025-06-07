import React from 'react';

const Button = ({ onClick, children, className, type = 'button', ...props }) => {
    return (
        <button onClick={onClick} className={className} type={type} {...props}>
            {children}
        </button>
    );
};

export default Button;
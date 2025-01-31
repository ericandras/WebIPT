//@ts-nocheck
import React from 'react';

const ChangeTableButton = ({children, onSelect, isSelected}) => {
    return (
        <button className={isSelected ? "active" :undefined} onClick={onSelect}>{children}</button>
    );
}

export default ChangeTableButton;

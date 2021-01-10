import React from 'react';
import { Link } from 'react-router-dom';

const MenuSectionItem = ({ text, to }) => (
  <div className="collapse-item">
    <Link to={to} style={{ textDecoration: 'none' }}>
      {text}
    </Link>
  </div>
);

export default MenuSectionItem;

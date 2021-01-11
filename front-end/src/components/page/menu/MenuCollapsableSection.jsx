import React, { useContext, useCallback, useMemo } from 'react';
import { Collapse } from 'react-bootstrap';

import MenuSectionOpenContext from './menuSectionOpen.context';

const MenuCollapsableSection = ({ id, icon, text, children }) => {
  const { sectionOpen, setSectionOpen } = useContext(MenuSectionOpenContext);

  const open = useMemo(() => sectionOpen === id, [sectionOpen, id]);

  const toggleSection = useCallback(() => {
    setSectionOpen(id);
  }, [setSectionOpen, id]);

  return (
    <li className="nav-item" onClick={toggleSection}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a data-toggle="collapse" className={`nav-link ${open ? 'active' : 'collapsed'}`}>
        {icon && <i className={icon} />}
        <span>{text}</span>
      </a>
      <Collapse in={open}>
        <div>
          <div className="bg-white py-2 collapse-inner rounded">{children}</div>
        </div>
      </Collapse>
    </li>
  );
};

export default MenuCollapsableSection;

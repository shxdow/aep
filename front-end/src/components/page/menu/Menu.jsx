import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import CollapsableSection from './MenuCollapsableSection';
import Divider from './MenuDivider';
import SectionItem from './MenuSectionItem';

import MenuSectionOpenContext from './menuSectionOpen.context';

const Menu = () => {
  const [sectionOpen, setSectionOpen] = useState('');
  const [isClient, setIsClient] = useState(false);

  const updateSection = useCallback((newSection) => {
    setSectionOpen((prevSection) => (prevSection === newSection ? '' : newSection));
  }, []);

  const value = useMemo(() => ({
    sectionOpen,
    setSectionOpen: updateSection,
  }), [updateSection, sectionOpen]);

  useEffect(() => {
    setIsClient(!!sessionStorage.getItem('client'));
  }, []);

  return (
    <MenuSectionOpenContext.Provider value={value}>
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
        <Link to="/">
          <div className="sidebar-brand d-flex align-items-center justify-content-center">
            <div className="sidebar-brand-icon">
              <i className="fa fa-clipboard-list" />
            </div>
            <div className="sidebar-brand-text mx-3">AI Ticketing</div>
          </div>
        </Link>

        <Divider />

        <CollapsableSection id="tickets" text="Ticket" icon="fa fa-clipboard-list">
          {isClient && <SectionItem to="/tickets/new" text="Apri un nuovo ticket" />}
          <SectionItem to="/tickets" text="I tuoi ticket" />
        </CollapsableSection>

        <CollapsableSection id="account" text="Account" icon="fa fa-user">
          <SectionItem to="/account" text="Il tuo account" />
        </CollapsableSection>
      </ul>
    </MenuSectionOpenContext.Provider>
  );
};

export default Menu;

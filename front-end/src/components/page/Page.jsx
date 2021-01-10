import React from 'react';

import Menu from './menu';
import TopBar from './top-bar';

const contentStyle = { height: '100%' };
const containerStyle = { height: '100%', overflowY: 'scroll' };

const Page = ({ title, children }) => (
  <div id="wrapper">
    <Menu />
    <div id="content-wrapper" className="d-flex flex-column">
      <div id="content" style={contentStyle}>
        <TopBar title={title} />
        <div className="container-fluid" style={containerStyle}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default Page;

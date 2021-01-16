import React, { useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const dimensions = { width: '100%', height: 500 };

const Table = ({ children, data, loading }) => {
  const gridApi = useRef(null);

  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
  }, []);

  useEffect(() => {
    if (!gridApi.current) {
      return;
    }

    if (loading) {
      gridApi.current.showLoadingOverlay();
    } else {
      gridApi.current.hideOverlay();
    }
  }, [loading]);

  return (
    <div className="ag-theme-balham" style={dimensions}>
      <AgGridReact
        onGridReady={onGridReady}
        overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading...</span>'}
        rowData={data}
      >
        {children}
      </AgGridReact>
    </div>
  );
};

export default Table;

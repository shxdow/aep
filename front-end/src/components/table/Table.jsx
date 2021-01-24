import React, { useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const dimensions = { width: '100%', height: 500 };

const Table = ({ children, data, loading, quickFilter, onRowSelected }) => {
  const gridApi = useRef(null);

  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
  }, []);

  useEffect(() => {
    if (loading) {
      gridApi.current?.showLoadingOverlay();
    } else {
      gridApi.current?.hideOverlay();
    }
  }, [loading]);

  const onSelectionChanged = useCallback((e) => {
    onRowSelected(e.api.getSelectedRows());
  }, [onRowSelected]);

  return (
    <div className="ag-theme-balham" style={dimensions}>
      <AgGridReact
        animateRows
        suppressColumnVirtualisation
        rowSelection="single"
        onGridReady={onGridReady}
        quickFilterText={quickFilter}
        overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading...</span>'}
        rowData={data}
        onSelectionChanged={onSelectionChanged}
      >
        {children}
      </AgGridReact>
    </div>
  );
};

export default Table;

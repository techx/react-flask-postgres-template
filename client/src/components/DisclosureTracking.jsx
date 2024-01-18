import React, { useState } from 'react';
import {
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Table, Modal, Input, ScrollArea, Group, MantineProvider, createTheme } from "@mantine/core";
import "./common.css"
import Select from 'react-select';

// Styling for Dropdown
const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '100px',        
    maxWidth: '150px',   
    minWidth: '100px', 
  }),
  menu: (provided) => ({
    ...provided,
    maxWidth: '250px' 
  }),
};

const DisclosureTracking = () => {
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const entriesToShowOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];
  const selectedEntriesToShow = entriesToShowOptions.find(option => option.value === entriesToShow);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSpecificRowData, setNewSpecificRowData] = useState({
    regulation: '',
    jurisdiction: '',
    first_reporting_year: '',
    report_due: '',
    disclosure_documents: '',
  });  

  const [columns, setColumns] = useState([
      { label: 'Potential Impacted Entitities', key: 'impacted' },
      { label: 'Regulation', key: 'regulation' },
      { label: 'Jurisdiction', key: 'jurisdiction' },
      { label: 'Reporting Year', key: 'first_reporting_year' },
      { label: 'Report Due', key: 'report_due' },
      { label: 'Disclosure Documents', key: 'disclosure_documents' },
  ]);

  const [columnFilters, setColumnFilters] = useState({
    impacted: [],
    regulation: [],
    jurisdiction: [],
    first_reporting_year: [],
    report_due: [],
    disclosure_documents: [],
  });  

  const initialRowData = columns.reduce((acc, column) => {
    acc[column.key] = ''; 
    return acc;
  }, {});  

  const [newRowData, setNewRowData] = useState(initialRowData);

  const [data, setData] = useState([
    { impacted: "no"},
    // Add more initial data as needed
  ]);


  const getUniqueColumnValues = (data, columnName) => {
    const unique = new Set();
    data.forEach(row => {
      if (row[columnName]) {
        unique.add(row[columnName]);
      }
    });
    return Array.from(unique);
  };
  
  const uniqueValuesForColumns = columns.reduce((acc, column) => {
    acc[column.key] = getUniqueColumnValues(data, column.key);
    return acc;
  }, {});  


  const applyFilters = (data) => {
    return data.filter(row => {
      return Object.keys(columnFilters).every(key => {
        const filterValues = columnFilters[key];
        if (!filterValues.length) return true; 
        return filterValues.includes(row[key]);
      });
    });
  };  

  const selectOptionsForColumns = Object.fromEntries(
    Object.entries(uniqueValuesForColumns).map(([key, values]) => [
      key,
      values.map(value => ({ value, label: value })),
    ])
  );

  const handleSelectChange = (selectedOptions, columnKey) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setColumnFilters({ ...columnFilters, [columnKey]: selectedValues });
  };
  

  //Search Bar
  const filterData = (data, query) => {
    if (!query) return data; 
  
    return data.filter(row =>
      columns.some(column =>
        row[column.key] ? row[column.key].toString().toLowerCase().includes(query.toLowerCase()) : false
      )
    );
  };  
  

  // Column Up Down Filter
  const [sortBy, setSortBy] = useState({
    columnKey: 'id',
    isDescending: false,
  });

  const handleSort = (columnKey) => {
    setSortBy({
      columnKey,
      isDescending: sortBy.columnKey === columnKey ? !sortBy.isDescending : false,
    });

    const sortedData = [...data].sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];

      if (sortBy.isDescending) {
        return valueB.localeCompare(valueA);
      } else {
        return valueA.localeCompare(valueB);
      }
    });

    setData(sortedData);
  };


  // Row Modal Logic
  
  const addRow = () => {
    setData(prevData => [...prevData, { ...newSpecificRowData, id: prevData.length + 1 }]);
    setIsRowModalOpen(false);
    setNewSpecificRowData({
      regulation: '',
      jurisdiction: '',
      first_reporting_year: '',
      report_due: '',
      disclosure_documents: '',
    });
  };  


  // Download CSV
  const convertToCSV = (data) => {
    const csvRows = [];

    const headers = columns.map(column => column.label);
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = columns.map(column => {
        const escaped = ('' + row[column.key]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'disclosure_tracking.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="users-container">
      <h1>Disclosure Tracking</h1>
      <div className="content-container">
        <div className="top-bar">
          <button className="button-bar" onClick={() => setIsRowModalOpen(true)}>Add New Entry</button>
        </div>
        <div className="top-controls">
          <div className="left-controls">
            <label htmlFor="entriesToShow">Show entries:</label>
            <br></br>
            <Select
              styles={customStyles}
              value={selectedEntriesToShow}
              onChange={(selectedOption) => setEntriesToShow(selectedOption.value)}
              options={entriesToShowOptions}
              style={{ width: '100px' }}
            />
            <button onClick={downloadCSV}>Export to CSV</button>
          </div>
          <div className="right-controls">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>

        {isRowModalOpen && (
          <Modal
            size="lg"
            opened={isRowModalOpen}
            title="Add New Row"
            onClose={() => setIsRowModalOpen(false)}
          >
            <div className="modal-grid">
              <div className="input-group">
                <label htmlFor="regulation">Regulation</label>
                <select
                  id="regulation"
                  value={newSpecificRowData.regulation}
                  onChange={(e) => setNewSpecificRowData({ ...newSpecificRowData, regulation: e.target.value })}
                  required
                >
                  <option value="Nothing Selected">Select</option>
                  <option value="Australian ISSB">Australian ISSB</option>
                  <option value="California Carbon Markets">California Carbon Markets</option>
                  <option value="California Climate Risks">California Climate Risks</option>
                  <option value="California Emissions">California Emissions</option>
                  <option value="CSDDD">CSDDD</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="jurisdiction">Jurisdiction</label>
                <Input
                  id="jurisdiction"
                  value={newSpecificRowData.jurisdiction}
                  onChange={(e) => setNewSpecificRowData({ ...newSpecificRowData, jurisdiction: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label htmlFor="first_reporting_year">Reporting Year</label>
                <select
                  id="first_reporting_year"
                  value={newSpecificRowData.first_reporting_year}
                  onChange={(e) => setNewSpecificRowData({ ...newSpecificRowData, first_reporting_year: e.target.value })}
                  required
                ></select>
              </div>
              <div className="input-group">
                <label htmlFor="report_due">Report Due</label>
                <select
                  id="report_due"
                  value={newSpecificRowData.report_due}
                  onChange={(e) => setNewSpecificRowData({ ...newSpecificRowData, report_due: e.target.value })}
                  required
                ></select>
              </div>
            </div>
            <div className="actions">
              <button onClick={addRow}>Add Row</button>
            </div>
          </Modal>
        )}


        <div>
          
          <div className="entries-info">
            Showing {filterData(applyFilters(data), searchQuery).length} of {data.length} entries
          </div>
          <table>
            <thead>
              
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    
                  >
                    {column.label}
                    {sortBy.columnKey === column.key && sortBy.isDescending && (
                      <IconChevronDown style={{ float: "right", opacity: 1 }} />
                    )}
                    {sortBy.columnKey === column.key && !sortBy.isDescending && (
                      <IconChevronUp style={{ float: "right", opacity: 1 }} />
                    )}
                    {sortBy.columnKey !== column.key && (
                      <>
                        <IconChevronDown style={{ float: "right", opacity: 0.5 }} />
                      </>
                    )}

                <Select
                  isMulti
                  value={columnFilters[column.key].map(val => ({ value: val, label: val }))}
                  onChange={(selectedOptions) => handleSelectChange(selectedOptions, column.key)}
                  options={selectOptionsForColumns[column.key]}
                />

                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterData(applyFilters(data), searchQuery).map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisclosureTracking;

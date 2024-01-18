import React, { useState } from 'react';
import {
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Table, Modal, Button, Input, ScrollArea, Group, MantineProvider, createTheme } from "@mantine/core";
import "./common.css"
import Papa from 'papaparse';
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

const Entities = () => {
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const entriesToShowOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];
  const selectedEntriesToShow = entriesToShowOptions.find(option => option.value === entriesToShow);
  

  const [columns, setColumns] = useState([
    { label: 'Entity', key: 'entity' },
    { label: 'Global Parent', key: 'global_parent' },
    { label: 'HoldCo', key: 'holdco' },
    { label: 'Listedin EU', key: 'listed_eu' },
    { label: 'Does Business in CA?', key: 'business_ca' },
    { label: 'Assigned To?', key: 'assigned_to' },
    { label: 'Actions'},
  ]);

  const [columnFilters, setColumnFilters] = useState({
    entity: [],
    global_parent: [],
    holdco: [],
    listed_eu: [],
    business_ca: [],
    assigned_to: [],
  });  

  const initialRowData = columns.reduce((acc, column) => {
    acc[column.key] = ''; 
    return acc;
  }, {});  

  const [newRowData, setNewRowData] = useState(initialRowData);

  const [editingRowData, setEditingRowData] = useState(null);

  const handleEditRow = (rowData) => {
    setEditingRowData(rowData);
    setIsRowModalOpen(true); 
  };



  const [data, setData] = useState([
    { referenceDate: '2022-01-01', eur: 1.0, usd: 1.1 },
    // Add more initial data as needed
  ]);

  // Sort Function
  const [sortBy, setSortBy] = useState({
    columnKey: 'referenceDate',
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


  // Adding New Data
  const handleInputChange = (key, value) => {
    setNewRowData({ ...newRowData, [key]: value });
  };
  
  const addRow = () => {
    setData(prevData => [...prevData, newRowData]);
    setIsRowModalOpen(!isRowModalOpen);
    setNewRowData(initialRowData);
  };

  const renderAddRowModal = () => {
    setIsRowModalOpen(true)
  };

  const updateRow = () => {
    setData(prevData => prevData.map(row => 
      (row.id === editingRowData.id) ? { ...row, ...newRowData } : row
    ));
    setIsRowModalOpen(!isRowModalOpen);
    setEditingRowData(initialRowData);
    setNewRowData(initialRowData); // Reset newRowData to initial state
  };  


  // Convert to CSV
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
    a.setAttribute('download', 'regulations.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        const csvData = mapCsvDataToTableColumns(results.data);
        setData(csvData);
      }
    });
  };

  const mapCsvDataToTableColumns = (csvData) => {
    return csvData.map(row => {
      return {
        entity: row['Entity'],
        global_parent: row['Global Parent'],
        holco: row['HoldCo'],
        listed_eu: row['Listedin EU'],
        business_ca: row['Does Business in CA?'],
        assigned_to: row['Assigned To?'],
        
      };
    });
  };  



  return (
    <div className="users-container">
      <h1>Entities</h1>
      <div className="content-container">
        <div className="top-bar">
          <button className="button-bar" onClick={() => renderAddRowModal()}>Add New Entity</button>
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
              <button onClick={() => document.getElementById('csvInput').click()}>Import Entities (CSV)</button>
              <input
                type="file"
                id="csvInput"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
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
            opened={!!isRowModalOpen}
            title={editingRowData ? "Edit Entity" : "Add New Entity"}
            onClose={() => {
              setIsRowModalOpen(!isRowModalOpen);
              setEditingRowData(null); 
            }}
          >
            {columns.map((column) => (
              column.key && ( 
                <div key={column.key} className="input-group">
                  <label htmlFor={column.key}>{column.label}</label>
                  <input
                    type="text"
                    id={column.key}
                    value={editingRowData ? editingRowData[column.key] : newRowData[column.key] || ''}
                    onChange={(e) => handleInputChange(column.key, e.target.value)}
                  />
                </div>
              )
            ))}
            <div className="actions">
              <button onClick={editingRowData ? () => updateRow() : () => addRow()}>
                {editingRowData ? "Update Row" : "Add Row"}
              </button>
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
                      key={column.key || 'actions'}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      {column.key && sortBy.columnKey === column.key && sortBy.isDescending && (
                        <IconChevronDown style={{ float: "right", opacity: 1 }} />
                      )}
                      {column.key && sortBy.columnKey === column.key && !sortBy.isDescending && (
                        <IconChevronUp style={{ float: "right", opacity: 1 }} />
                      )}
                      {column.key && sortBy.columnKey !== column.key && (
                        <>
                          <IconChevronDown style={{ float: "right", opacity: 0.5 }} />
                        </>
                      )}
                    {column.key && (
                      <Select
                        isMulti
                        value={columnFilters[column.key].map(val => ({ value: val, label: val }))}
                        onChange={(selectedOptions) => handleSelectChange(selectedOptions, column.key)}
                        options={selectOptionsForColumns[column.key]}
                      />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filterData(applyFilters(data), searchQuery).map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key || 'actions'}>
                        {column.key ? row[column.key] : 
                          <button onClick={() => handleEditRow(row)}>Edit</button>
                        }
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

export default Entities;
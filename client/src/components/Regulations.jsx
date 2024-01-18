import React, { useState } from 'react';
import {
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Table, Modal, Button, Input, ScrollArea, Group, MantineProvider, createTheme } from "@mantine/core";
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
    maxWidth: '250px',
  }),
};


const Regulations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    { label: 'Regulation', key: 'regulation' },
    { label: 'Regulator', key: 'regulator' },
    { label: 'Country', key: 'country' },
    { label: 'Status', key: 'status' },
    { label: 'Mandatory', key: 'mandatory' },
    { label: 'Enabled', key: 'enabled' },
  ]);

  const [columnFilters, setColumnFilters] = useState({
    regulation: [],
    regulator: [],
    country: [],
    status: [],
    mandatory: [],
    enabled: [],
  });  

  const initialRowData = columns.reduce((acc, column) => {
    acc[column.key] = ''; 
    return acc;
  }, {});  

  const [newRowData, setNewRowData] = useState(initialRowData);


  const [data, setData] = useState([
    { regulation: 'yes', eur: 1.0, usd: 1.1 },
    // Add more initial data as needed
  ]);

  const [sortBy, setSortBy] = useState({
    columnKey: 'referenceDate',
    isDescending: false,
  });

  const handleSort = (columnKey) => {
    setSortBy({
      columnKey,
      isDescending: sortBy.columnKey === columnKey ? !sortBy.isDescending : false,
    });

    // Sort the data
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

  const createModalRename = (content) => {
    setIsModalOpen(
      <Modal
        opened={!!isModalOpen}
        title="Add New Row"
        onClose={() => setIsModalOpen(!isModalOpen)}
      >
        <span className="name-content">
          {content}
        </span>
        <div>
          <br></br>
        </div>
        <Input id="form-input-rename" required></Input>
        <div>
          <br></br>
        </div>
        <Group justify="center">
          <Button
            color="blue"
            variant="filled"
            onClick={() => {
              addColumn(document.getElementById("form-input-rename").value);
              setIsModalOpen(!isModalOpen);
            }}
          >
            Add
          </Button>
        </Group>
      </Modal>
    );
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



  return (
    <div className="users-container">
      <h1>Regulations</h1>
      <div className="content-container">
      <div className="content-container">
        <div className="top-bar">
          <button className="button-bar" onClick={() => renderAddRowModal()}>Add New Regulation</button>
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

        {isRowModalOpen && (<Modal
          opened={!!isRowModalOpen}
          title="Add New Regulation"
          onClose={() => setIsRowModalOpen(!isRowModalOpen)}
        >
          {columns.map((column) => (
            <div key={column.key} className="input-group">
              <label htmlFor={column.key}>{column.label}</label>
              <input
                type="text"
                id={column.key}
                value={newRowData[column.key] || ''}
                onChange={(e) => handleInputChange(column.key, e.target.value)}
              />
            </div>
          ))}
          <div className="actions">
            <button onClick={() => addRow()}>Add Row</button>
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
  </div>
  );
};

export default Regulations;
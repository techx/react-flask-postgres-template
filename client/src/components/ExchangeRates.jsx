import React, { useState } from 'react';
import {
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Table, Modal, Input, ScrollArea, Group, MantineProvider, createTheme } from "@mantine/core";
import "./common.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExchangeRates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [columns, setColumns] = useState([
    { label: 'Reference Date', key: 'referenceDate' },
    { label: 'EUR', key: 'eur' },
    { label: 'USD', key: 'usd' },
    { label: 'AED', key: 'aed' },
    { label: 'AUD', key: 'aud' },
    { label: 'CAD', key: 'cad' },
    { label: 'CNY', key: 'cny' },
    { label: 'DKK', key: 'dkk' },
    { label: 'GBP', key: 'gbp' },
    { label: 'HKD', key: 'hkd' },
    { label: 'INR', key: 'inr' },
    { label: 'ISK', key: 'isk' },
  ]);

  const initialRowData = columns.reduce((acc, column) => {
    acc[column.key] = ''; // Set each column's initial value to an empty string
    return acc;
  }, {});  

  const [newRowData, setNewRowData] = useState(initialRowData);


  const [data, setData] = useState([
    { referenceDate: '2024-01-12', eur: 1.0, usd: 1.1 },
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


  const addColumn = (newColumn) => {
    if (newColumn) {
      setColumns([...columns, { label: newColumn, key: newColumn.toLowerCase() }]);
    }
  };


  const handleInputChange = (key, value) => {
    if (key === 'referenceDate') {
      const dateValue = value ? value.toISOString().split('T')[0] : '';
      setNewRowData({ ...newRowData, [key]: dateValue });
    } else {
      setNewRowData({ ...newRowData, [key]: value });
    }
  };
  
  const addRow = () => {
    setData(prevData => [...prevData, newRowData]);
    setIsRowModalOpen(!isRowModalOpen);
    setNewRowData(initialRowData);
  };

  const renderAddRowModal = () => {
    setIsRowModalOpen(true)
  };

  const createModalRename = () => {
    setIsModalOpen(
      <Modal
        opened={!!isModalOpen}
        title="Add New Column"
        size="lg"
        fullscreen
        scrollAreaComponent={ScrollArea.Autosize}
        onClose={() => setIsModalOpen(!isModalOpen)}
      >
        <div>
          <br></br>
        </div>
        <Input id="form-input-rename" required></Input>
        <div>
          <br></br>
        </div>
        <Group justify="right">
          <button
            className="actions"
            color="blue"
            variant="filled"
            onClick={() => {
              addColumn(document.getElementById("form-input-rename").value);
              setIsModalOpen(!isModalOpen);
            }}
          >
            Add
          </button>
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
    a.setAttribute('download', 'exchange_rates.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  return (
    <div className="users-container">
      <h1>Exchange Rates</h1>
      <div className="content-container">
        <button onClick={downloadCSV}>Export to CSV</button>
        <button onClick={() => {createModalRename()}}>Add Column</button>
        <button onClick={() => renderAddRowModal()}>Add Row</button>
        {isModalOpen}
        
        {isRowModalOpen && (<Modal
          size="lg"
          fullscreen
          opened={!!isRowModalOpen}
          title="Add New Row"
          scrollAreaComponent={ScrollArea.Autosize}
          onClose={() => setIsRowModalOpen(!isRowModalOpen)}
        >
          {columns.map((column) => (
            <div key={column.key} className="input-group">
              <label htmlFor={column.key}>{column.label}</label>
              {column.key === 'referenceDate' ? (
                <DatePicker
                  selected={newRowData[column.key] ? new Date(newRowData[column.key]) : null}
                  onChange={(date) => handleInputChange(column.key, date)}
                  dateFormat="yyyy-MM-dd"
                />
              ) : (
                <input
                  type="text"
                  id={column.key}
                  value={newRowData[column.key] || ''}
                  onChange={(e) => handleInputChange(column.key, e.target.value)}
                  required
                />
              )}
            </div>
          ))}
          <div className="actions">
            <button onClick={() => addRow()}>Add Row</button>
          </div>
        </Modal>
      )}


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
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
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
  );
};

export default ExchangeRates;

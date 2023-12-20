import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});

  useEffect(() => {
    // Fetch transactions based on selected month and search text
    axios.get(`http://127.0.0.1:3001/api/list-transactions?month=${selectedMonth}&search=${searchText}&page=${currentPage}`)
      .then(response => {
        console.log('Transactions Data:', response.data);
        setTransactions(response.data);
      })
      .catch(error => console.error(error));

    // Fetch statistics based on selected month
    axios.get(`http://127.0.0.1:3001/api/statistics?month=${selectedMonth}`)
      .then(response => {
        console.log('Statistics Data:', response.data);
        setTotalSaleAmount(response.data.totalSaleAmount);
        setTotalSoldItems(response.data.totalSoldItems);
        setTotalNotSoldItems(response.data.totalNotSoldItems);
      })
      .catch(error => console.error(error));

    // Fetch bar chart data based on selected month
    axios.get(`http://127.0.0.1:3001/api/bar-chart?month=${selectedMonth}`)
      .then(response => {
        console.log('Bar Chart Data:', response.data);
        setBarChartData(response.data);
      })
      .catch(error => console.error(error));

    // Fetch pie chart data based on selected month
    axios.get(`http://127.0.0.1:3001/api/pie-chart?month=${selectedMonth}`)
      .then(response => {
        console.log('Pie Chart Data:', response.data);
        setPieChartData(response.data);
      })
      .catch(error => console.error(error));
  }, [selectedMonth, searchText, currentPage]);


  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
  };

  // Add other UI elements (transaction table, statistics, charts, etc.) based on your requirements
  const monthMapping = {
    'January': '1',
    'February': '2',
    'March': '3',
    'April': '4',
    'May': '5',
    'June': '6',
    'July': '7',
    'August': '8',
    'September': '9',
    'October': '10',
    'November': '11',
    'December': '12',
  };

  return (
    <div className="App">
      <h1>Transactions Table</h1>
      <div>
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(monthMapping[e.target.value])}>
          {/* Add options for Jan to Dec */}
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div>
        <label>Search Transactions:</label>
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </div>
      {/* Display the transactions table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Date of Sale</th>
            {/* ... Add other columns ... */}
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.dateOfSale ? new Date(transaction.dateOfSale).toLocaleDateString() : 'Not Sold'}</td>
              {/* ... Add other cells ... */}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>

      <div>
        <h2>Transactions Statistics</h2>
        <p>Total Sale Amount: ${totalSaleAmount}</p>
        <p>Total Sold Items: {totalSoldItems}</p>
        <p>Total Not Sold Items: {totalNotSoldItems}</p>
      </div>

      {/* Bar Chart */}
      <h2>Bar Chart</h2>
      <Bar
        data={{
          labels: barChartData.labels || [],
          datasets: barChartData.datasets || [],
        }}
      />

      {/* Pie Chart */}
      <h2>Pie Chart</h2>
      <Pie
        data={{
          labels: pieChartData.labels || [],
          datasets: pieChartData.datasets || [],
        }}
      />
    </div>
  );
};

export default App;

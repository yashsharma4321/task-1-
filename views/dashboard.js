<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        /* Basic styling */
        .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
        }
        .table-container, .statistics, .chart-container {
            margin-bottom: 40px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }
        .pagination {
            text-align: center;
            margin-top: 20px;
        }
        .pagination button {
            padding: 10px;
            margin: 0 5px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }
        .pagination button:disabled {
            background-color: #ddd;
        }
        .statistics {
            display: flex;
            justify-content: space-between;
        }
        .stat-box {
            background-color: #f4f4f4;
            padding: 20px;
            width: 30%;
            text-align: center;
            border-radius: 5px;
        }
        .stat-box h4 {
            margin: 10px 0;
        }
        .stat-box p {
            font-size: 18px;
        }
        .dropdown-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .search-container input {
            padding: 5px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="dropdown-container">
            <form method="GET" action="/">
                <select name="month" onchange="this.form.submit()">
                    <option value="1" <%= month === 1 ? 'selected' : '' %>>January</option>
                    <option value="2" <%= month === 2 ? 'selected' : '' %>>February</option>
                    <option value="3" <%= month === 3 ? 'selected' : '' %>>March</option>
                    <option value="4" <%= month === 4 ? 'selected' : '' %>>April</option>
                    <option value="5" <%= month === 5 ? 'selected' : '' %>>May</option>
                    <option value="6" <%= month === 6 ? 'selected' : '' %>>June</option>
                    <option value="7" <%= month === 7 ? 'selected' : '' %>>July</option>
                    <option value="8" <%= month === 8 ? 'selected' : '' %>>August</option>
                    <option value="9" <%= month === 9 ? 'selected' : '' %>>September</option>
                    <option value="10" <%= month === 10 ? 'selected' : '' %>>October</option>
                    <option value="11" <%= month === 11 ? 'selected' : '' %>>November</option>
                    <option value="12" <%= month === 12 ? 'selected' : '' %>>December</option>
                </select>
            </form>
            <input type="text" id="searchBox" placeholder="Search transactions...">
        </div>

        <div class="statistics">
            <div class="stat-box">
                <h4>Total Sale</h4>
                <p><%= stats.totalSale %></p>
            </div>
            <div class="stat-box">
                <h4>Total Sold Items</h4>
                <p><%= stats.totalSoldItems %></p>
            </div>
            <div class="stat-box">
                <h4>Total Not Sold Items</h4>
                <p><%= stats.totalNotSoldItems %></p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <% transactions.forEach(transaction => { %>
                    <tr>
                        <td><%= transaction.title %></td>
                        <td><%= transaction.description %></td>
                        <td><%= transaction.price %></td>
                        <td><%= transaction.date %></td>
                    </tr>
                <% }) %>
            </tbody>
        </table>

        <div class="pagination">
            <button>< Previous</button>
            <button>Next ></button>
        </div>

        <div class="chart-container">
            <h3>Transaction Bar Chart</h3>
            <canvas id="myChart"></canvas>
        </div>
    </div>

    <script>
        const chartData = <%- JSON.stringify(chartData) %>;
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Price Range',
                    data: chartData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                },
            },
        });
    </script>
</body>
</html>

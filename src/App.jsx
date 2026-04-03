import { useState } from "react";
import { transactions as initialData } from "./data/mockData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {
  const [role, setRole] = useState("viewer");
  const [transactions, setTransactions] = useState(initialData);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    type: "expense",
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add transaction
  const handleAdd = () => {
    if (!form.category || !form.amount) return;

    const newTransaction = {
      id: Date.now(),
      category: form.category,
      amount: Number(form.amount),
      type: form.type,
    };

    setTransactions([newTransaction, ...transactions]);

    setForm({
      category: "",
      amount: "",
      type: "expense",
    });
  };

  // Summary
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  // Filter + Search
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || t.type === filter;

    return matchesSearch && matchesFilter;
  });

  // Pie chart data
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const existing = acc.find((i) => i.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  // Line chart data
  const lineData = transactions.map((t) => ({
    name: t.category,
    amount: t.amount,
  }));

  return (
    <div className="p-6">
      {/* Role Selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Admin Form */}
      {role === "admin" && (
        <div className="mb-6 border p-4 rounded shadow">
          <h2 className="font-bold mb-2">Add Transaction</h2>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 mr-2 mb-2"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 mr-2 mb-2"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 mr-2 mb-2"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <br />

          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Transaction
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Summary */}
      <div className="flex gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          Income: ₹{income}
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          Expense: ₹{expense}
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          Balance: ₹{balance}
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-wrap gap-10 mb-10">
        <div>
          <h2 className="font-bold mb-2">Expense Breakdown</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {expenseData.map((_, i) => (
                <Cell key={i} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div>
          <h2 className="font-bold mb-2">Transaction Trend</h2>
          <LineChart width={400} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" />
          </LineChart>
        </div>
      </div>

      {/* Transactions */}
      {filteredTransactions.map((t) => (
        <div
          key={t.id}
          className="border p-4 mb-3 rounded shadow"
        >
          <p className="font-semibold">{t.category}</p>
          <p>₹{t.amount}</p>
          <p
            className={
              t.type === "income"
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {t.type}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
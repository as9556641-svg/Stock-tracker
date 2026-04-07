import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import api from "../api/axios";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import ExportButtons from "../components/ExportButtons";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import PortfolioCharts from "../components/PortfolioCharts";
import StockCard from "../components/StockCard";
import StockEditModal from "../components/StockEditModal";
import StockForm from "../components/StockForm";
import SummaryCard from "../components/SummaryCard";
import TransactionHistory from "../components/TransactionHistory";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { formatCurrency, formatDateTime, formatNumber, formatSignedCurrency } from "../utils/formatters";

function DashboardPage() {
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState(StockForm.initialValues);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [refreshingId, setRefreshingId] = useState("");
  const [error, setError] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("ALL");
  const [editingStock, setEditingStock] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useNotifications();

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError("");

      const [stocksResponse, transactionsResponse] = await Promise.all([
        api.get("/stocks"),
        api.get("/stocks/transactions")
      ]);

      setStocks(stocksResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load portfolio data.");
      addToast("Unable to load portfolio data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const portfolioValue = stocks.reduce((sum, stock) => sum + stock.quantity * stock.price, 0);
  const investedValue = stocks.reduce(
    (sum, stock) => sum + stock.quantity * stock.averageCost,
    0
  );
  const profitLoss = portfolioValue - investedValue;

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const stockProfit = (stock.price - stock.averageCost) * stock.quantity;
      const matchesPerformance =
        performanceFilter === "ALL" ||
        (performanceFilter === "PROFIT" && stockProfit >= 0) ||
        (performanceFilter === "LOSS" && stockProfit < 0);

      return matchesSearch && matchesPerformance;
    });
  }, [performanceFilter, searchTerm, stocks]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleReset = () => {
    setFormData(StockForm.initialValues);
    setQuoteError("");
  };

  const handleFetchQuote = async () => {
    if (!formData.symbol.trim()) {
      setQuoteError("Enter a stock symbol first");
      return null;
    }

    try {
      setQuoteLoading(true);
      setQuoteError("");
      const response = await api.get(`/market/quote/${formData.symbol.trim().toUpperCase()}`);
      setFormData((current) => ({
        ...current,
        symbol: response.data.symbol,
        price: String(response.data.price)
      }));
      addToast(`Fetched live price for ${response.data.symbol}`);
      return response.data;
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to fetch live stock price.";
      setQuoteError(message);
      addToast(message, "error");
      return null;
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleAddStock = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const quote = !formData.price ? await handleFetchQuote() : null;

      await api.post("/stocks", {
        ...formData,
        symbol: formData.symbol.toUpperCase(),
        price: quote?.price ?? formData.price
      });

      handleReset();
      await fetchPortfolioData();
      addToast("Stock added");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to add stock.";
      setError(message);
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      setDeletingId(id);
      setError("");
      await api.delete(`/stocks/${id}`);
      await fetchPortfolioData();
      addToast("Stock deleted");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to delete stock.";
      setError(message);
      addToast(message, "error");
    } finally {
      setDeletingId("");
    }
  };

  const handleRefreshPrice = async (id) => {
    try {
      setRefreshingId(id);
      await api.post(`/stocks/${id}/refresh-price`);
      await fetchPortfolioData();
      addToast("Live stock price updated");
    } catch (requestError) {
      addToast(requestError.response?.data?.message || "Unable to refresh stock price.", "error");
    } finally {
      setRefreshingId("");
    }
  };

  const handleSaveEdit = async (payload) => {
    try {
      setSavingEdit(true);
      await api.put(`/stocks/${editingStock._id}`, payload);
      setEditingStock(null);
      await fetchPortfolioData();
      addToast("Stock updated");
    } catch (requestError) {
      addToast(requestError.response?.data?.message || "Unable to update stock.", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ["Name", "Symbol", "Quantity", "Current Price", "Buy Price", "Total Value", "Profit/Loss"],
      ...stocks.map((stock) => [
        stock.name,
        stock.symbol,
        stock.quantity,
        stock.price,
        stock.averageCost,
        stock.quantity * stock.price,
        (stock.price - stock.averageCost) * stock.quantity
      ])
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "portfolio.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    addToast("Portfolio exported as CSV");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4"
    });
    const generatedAt = formatDateTime(new Date());

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 88, "F");
    doc.setTextColor(241, 245, 249);
    doc.setFontSize(20);
    doc.text("Stock Portfolio Report", 40, 40);
    doc.setFontSize(10);
    doc.text(`Generated: ${generatedAt}`, 40, 60);
    doc.text(`Total Portfolio Value: ${formatCurrency(portfolioValue)}`, 40, 76);

    autoTable(doc, {
      head: [["Name", "Symbol", "Qty", "Current", "Buy", "Value", "P/L"]],
      body: stocks.map((stock) => [
        stock.name,
        stock.symbol,
        formatNumber(stock.quantity, 0),
        formatCurrency(stock.price),
        formatCurrency(stock.averageCost),
        formatCurrency((Number(stock.quantity) || 0) * (Number(stock.price) || 0)),
        formatSignedCurrency(((Number(stock.price) || 0) - (Number(stock.averageCost) || 0)) * (Number(stock.quantity) || 0))
      ]),
      startY: 108,
      margin: {
        left: 40,
        right: 40
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [241, 245, 249],
        fontStyle: "bold",
        halign: "left"
      },
      bodyStyles: {
        textColor: [30, 41, 59],
        cellPadding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        },
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
        valign: "middle"
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 120 },
        1: { halign: "left", cellWidth: 58 },
        2: { halign: "right", cellWidth: 52 },
        3: { halign: "right", cellWidth: 78 },
        4: { halign: "right", cellWidth: 78 },
        5: { halign: "right", cellWidth: 88 },
        6: { halign: "right", cellWidth: 88 }
      },
      styles: {
        fontSize: 10,
        overflow: "linebreak"
      }
    });
    doc.save("portfolio.pdf");
    addToast("Portfolio exported as PDF");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    addToast("Logged out successfully");
    navigate("/login");
  };

  const profitLossTone = profitLoss > 0 ? "success" : profitLoss < 0 ? "danger" : "default";

  return (
    <div className="min-h-screen">
      <Navbar onLogout={handleLogout} user={user} />
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Logout"
        isOpen={isLogoutModalOpen}
        message="Are you sure you want to logout?"
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm logout"
      />
      <StockEditModal
        isOpen={Boolean(editingStock)}
        onClose={() => setEditingStock(null)}
        onSave={handleSaveEdit}
        saving={savingEdit}
        stock={editingStock}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid items-stretch gap-5 lg:grid-cols-3">
          <SummaryCard
            helper="Current market value of all your positions"
            title="Total Portfolio Value"
            value={formatCurrency(portfolioValue)}
          />
          <SummaryCard
            helper="How much you originally paid for your shares"
            title="Total Invested"
            value={formatCurrency(investedValue)}
          />
          <SummaryCard
            helper="Positive means your portfolio is up overall"
            title="Profit / Loss"
            tone={profitLossTone}
            value={formatSignedCurrency(profitLoss)}
          />
        </section>

        <section className="mt-10 grid items-start gap-8 xl:grid-cols-[400px_minmax(0,1fr)]">
          <StockForm
            formData={formData}
            loading={submitting}
            onChange={handleChange}
            onFetchQuote={handleFetchQuote}
            onReset={handleReset}
            onSubmit={handleAddStock}
            quoteError={quoteError}
            quoteLoading={quoteLoading}
          />

          <div className="space-y-6">
            <div className="panel px-6 py-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                    Holdings Overview
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-[#f1f5f9]">
                    Your stock positions
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Track live pricing, compare positions, and export your portfolio with ease.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <input
                    className="input w-full lg:w-72"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name or symbol"
                    value={searchTerm}
                  />
                  <select
                    className="input lg:w-48"
                    onChange={(event) => setPerformanceFilter(event.target.value)}
                    value={performanceFilter}
                  >
                    <option value="ALL">All stocks</option>
                    <option value="PROFIT">Profit stocks</option>
                    <option value="LOSS">Loss stocks</option>
                  </select>
                  <ExportButtons onExportCsv={handleExportCsv} onExportPdf={handleExportPdf} />
                </div>
              </div>
            </div>

            {error ? <Alert message={error} /> : null}

            {loading ? (
              <div className="panel p-10">
                <LoadingSpinner label="Loading your portfolio..." />
              </div>
            ) : filteredStocks.length === 0 ? (
              <div className="panel p-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  No matching stocks
                </p>
                <h3 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  Add a stock or adjust your filters
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Use the live quote button to fetch current price by symbol, then add positions to
                  your portfolio.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                {filteredStocks.map((stock) => (
                  <StockCard
                    deletingId={deletingId}
                    key={stock._id}
                    onDelete={handleDeleteStock}
                    onEdit={setEditingStock}
                    onRefresh={handleRefreshPrice}
                    refreshingId={refreshingId}
                    stock={stock}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="mt-10">
          <PortfolioCharts stocks={stocks} transactions={transactions} />
        </div>

        <div className="mt-10">
          <TransactionHistory transactions={transactions} />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

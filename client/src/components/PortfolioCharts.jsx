import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatCompactCurrency, formatCurrency } from "../utils/formatters";

const chartColors = ["#0f766e", "#0284c7", "#2563eb", "#7c3aed", "#ea580c", "#dc2626"];

function PortfolioCharts({ stocks, transactions }) {
  const distributionData = stocks.map((stock) => ({
    name: stock.symbol,
    value: stock.quantity * stock.price
  }));

  let runningTotal = 0;
  const growthData = transactions
    .slice()
    .reverse()
    .map((transaction) => {
      runningTotal += transaction.amountChanged || 0;

      return {
        label: new Date(transaction.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        value: Number(runningTotal.toFixed(2))
      };
    });

  if (!growthData.length) {
    growthData.push({ label: "Start", value: 0 });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="panel p-6 dark:border-slate-800/80 dark:bg-slate-900/85">
        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Portfolio growth
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          A timeline of how your invested capital changed with each portfolio action.
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis
                stroke="#94a3b8"
                tickFormatter={(value) => formatCompactCurrency(value)}
                width={70}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line
                dataKey="value"
                dot={false}
                stroke="#0f766e"
                strokeLinecap="round"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel p-6 dark:border-slate-800/80 dark:bg-slate-900/85">
        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Stock distribution
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Current portfolio allocation based on market value.
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData.length ? distributionData : [{ name: "No data", value: 1 }]}
                dataKey="value"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
              >
                {(distributionData.length ? distributionData : [{ name: "No data", value: 1 }]).map(
                  (entry, index) => (
                    <Cell
                      fill={distributionData.length ? chartColors[index % chartColors.length] : "#cbd5e1"}
                      key={`${entry.name}-${index}`}
                    />
                  )
                )}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default PortfolioCharts;

const API_BASE = "/api";
const TOKEN_KEY = "stockPortfolioToken";
const USER_KEY = "stockPortfolioUser";

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const stockForm = document.getElementById("stock-form");
const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");
const stockList = document.getElementById("stock-list");
const stockCount = document.getElementById("stock-count");
const messageEl = document.getElementById("message");
const welcomeText = document.getElementById("welcome-text");
const logoutBtn = document.getElementById("logout-btn");
const tabs = document.querySelectorAll(".tab");

const showMessage = (message, type = "") => {
  messageEl.textContent = message;
  messageEl.className = `message ${type}`.trim();
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const setAuthView = () => {
  authSection.classList.remove("hidden");
  dashboard.classList.add("hidden");
};

const setDashboardView = () => {
  const user = getCurrentUser();
  welcomeText.textContent = user ? `${user.name}'s Portfolio` : "Portfolio";
  authSection.classList.add("hidden");
  dashboard.classList.remove("hidden");
};

const switchTab = (tabName) => {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  loginForm.classList.toggle("hidden", tabName !== "login");
  signupForm.classList.toggle("hidden", tabName !== "signup");
  showMessage("");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value || 0);

const renderStocks = (stocks) => {
  stockCount.textContent = `${stocks.length} stock${stocks.length === 1 ? "" : "s"}`;

  if (!stocks.length) {
    stockList.innerHTML = '<div class="empty-state">No stocks yet. Add your first stock above.</div>';
    return;
  }

  stockList.innerHTML = stocks
    .map(
      (stock) => `
        <article class="stock-item">
          <div class="stock-item-top">
            <div>
              <span class="symbol-tag">${stock.symbol}</span>
              <h4>${stock.name}</h4>
              <p class="stock-meta">${stock.quantity} shares</p>
            </div>
            <button class="delete-btn" data-id="${stock._id}">Delete</button>
          </div>
          <div class="stock-grid">
            <div>
              <span class="stock-label">Current Price</span>
              <strong>${formatCurrency(stock.price)}</strong>
            </div>
            <div>
              <span class="stock-label">Total Value</span>
              <strong>${formatCurrency(stock.quantity * stock.price)}</strong>
            </div>
            <div>
              <span class="stock-label">Profit / Loss</span>
              <strong>${formatCurrency((stock.price - stock.averageCost) * stock.quantity)}</strong>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const loadStocks = async () => {
  try {
    const stocks = await request("/stocks");
    renderStocks(stocks);
  } catch (error) {
    if (error.message.includes("token")) {
      clearSession();
      setAuthView();
    }
    showMessage(error.message, "error");
  }
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const payload = {
      email: document.getElementById("login-email").value.trim(),
      password: document.getElementById("login-password").value
    };

    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    saveSession(data.token, data.user);
    setDashboardView();
    await loadStocks();
    loginForm.reset();
    showMessage("Logged in successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const payload = {
      name: document.getElementById("signup-name").value.trim(),
      email: document.getElementById("signup-email").value.trim(),
      password: document.getElementById("signup-password").value
    };

    const data = await request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    saveSession(data.token, data.user);
    setDashboardView();
    await loadStocks();
    signupForm.reset();
    showMessage("Account created successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

stockForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const payload = {
      name: document.getElementById("stock-name").value.trim(),
      symbol: document.getElementById("stock-symbol").value.trim().toUpperCase(),
      quantity: Number(document.getElementById("stock-quantity").value),
      price: Number(document.getElementById("stock-price").value),
      averageCost: Number(document.getElementById("stock-average-cost").value)
    };

    await request("/stocks", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    stockForm.reset();
    await loadStocks();
    showMessage("Stock added.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

stockList.addEventListener("click", async (event) => {
  const button = event.target.closest(".delete-btn");
  if (!button) {
    return;
  }

  try {
    await request(`/stocks/${button.dataset.id}`, { method: "DELETE" });
    await loadStocks();
    showMessage("Stock deleted.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

logoutBtn.addEventListener("click", () => {
  clearSession();
  setAuthView();
  stockList.innerHTML = "";
  stockCount.textContent = "0 stocks";
  showMessage("Logged out.");
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

const initializeApp = async () => {
  const token = getToken();

  if (!token) {
    setAuthView();
    switchTab("login");
    return;
  }

  setDashboardView();
  await loadStocks();
};

initializeApp();

/**
 * SpendWise Logic
 * Handles data persistence, DOM manipulation, and financial calculations
 */

const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

// State management
let transactions = JSON.parse(localStorage.getItem('spendwise_transactions')) || [];

/**
 * Update UI and Calculations
 */
function updateUI() {
    list.innerHTML = '';
    
    if (transactions.length === 0) {
        list.innerHTML = `
            <div class="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <p class="text-slate-400 italic">Your history is empty.</p>
            </div>
        `;
    } else {
        transactions.forEach(renderTransaction);
    }
    
    updateTotals();
}

/**
 * Render individual transaction element
 */
function renderTransaction(transaction) {
    const isIncome = transaction.type === 'income';
    const item = document.createElement('div');
    
    item.className = 'transaction-item animate-entry bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group';

    item.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="p-2 rounded-lg ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                ${isIncome ? '↑' : '↓'}
            </div>
            <div>
                <p class="font-bold text-slate-800">${transaction.text}</p>
                <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">${transaction.type}</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <p class="font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">
                ${isIncome ? '+' : '-'}$${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <button class="delete-btn p-1 text-slate-300 hover:text-rose-500 transition-all" onclick="removeTransaction(${transaction.id})">
                ✕
            </button>
        </div>
    `;

    list.appendChild(item);
}

/**
 * Update Financial Totals
 */
function updateTotals() {
    const totals = transactions.reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
    }, { income: 0, expense: 0 });

    const totalBalance = (totals.income - totals.expense).toFixed(2);

    balance.innerText = `$${parseFloat(totalBalance).toLocaleString()}`;
    income.innerText = `+$${totals.income.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    expense.innerText = `-$${totals.expense.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

/**
 * CRUD Operations
 */
function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') return;

    const transaction = {
        id: Date.now(),
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    transactions.unshift(transaction);
    saveToStorage();
    updateUI();

    textInput.value = '';
    amountInput.value = '';
    textInput.focus();
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToStorage();
    updateUI();
}

function saveToStorage() {
    localStorage.setItem('spendwise_transactions', JSON.stringify(transactions));
}

// Event Listeners
form.addEventListener('submit', addTransaction);

// Initial Load
updateUI();
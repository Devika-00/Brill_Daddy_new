import React, { useState, useEffect } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const Wallet = () => {

    const [balance] = useState(5249.50);
  const [transactions] = useState([
    {
      id: 1,
      type: 'credit',
      amount: 1200.00,
      description: 'Salary Deposit',
      date: '2024-03-05 14:30',
    },
    {
      id: 2,
      type: 'debit',
      amount: 45.50,
      description: 'Coffee Shop',
      date: '2024-03-04 09:15',
    },
    {
      id: 3,
      type: 'credit',
      amount: 500.00,
      description: 'Freelance Payment',
      date: '2024-03-03 16:45',
    },
    {
      id: 4,
      type: 'debit',
      amount: 89.99,
      description: 'Online Shopping',
      date: '2024-03-02 11:20',
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="flex-1 p-4 md:p-6 space-y-6">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Current Balance</h2>
          <div className="text-3xl md:text-4xl font-bold text-gray-900">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Left side - Icon and Description */}
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' 
                      ? <ArrowDownLeft className="h-5 w-5" />
                      : <ArrowUpRight className="h-5 w-5" />
                    }
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side - Amount */}
                <div className={`font-semibold ${
                  transaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default Wallet;

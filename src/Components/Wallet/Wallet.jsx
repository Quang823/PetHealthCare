import './Wallet.scss';
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const fetchWalletData = useCallback(() => {
        const userID = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).User.map.userID;

        axios.get(`http://localhost:8080/wallet/get-by-user?userId=${userID}`)
            .then(res => {
                if (res.data.status === "ok" && res.data.data) {
                    setWallet(res.data.data);
                    localStorage.setItem('walletId', res.data.data.walletId);
                } else {
                    console.error('Unexpected wallet data structure:', res.data);
                }
            })
            .catch(err => {
                console.error('There was an error fetching the wallet data!', err);
            });
    }, []);

    const fetchTransactions = useCallback(() => {
        const walletId = localStorage.getItem('walletId');

        axios.get(`http://localhost:8080/payment/getAll?walletId=${walletId}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setTransactions(res.data);
                } else {
                    console.error('Unexpected transactions data structure:', res.data);
                }
            })
            .catch(err => {
                console.error('There was an error fetching the transactions data!', err);
            });
    }, []);

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
    
        if (vnpResponseCode) {
            handleVNPayReturn();
        }
    }, [location.search]);

    const handleDeposit = async () => {
        if (!wallet || !depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/payment/vn-pay`, {
                params: {
                    amount: depositAmount,
                    walletId: wallet.walletId
                }
            });

            if (response.data.status === "ok" && response.data.data) {
                window.location.href = response.data.data;
            } else {
                alert('Error creating payment. Please try again.');
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Error creating payment. Please try again.');
        }
    };

    const handleWithdraw = () => {
        // Implement withdraw logic here
        alert('Withdraw functionality not implemented yet');
    };

    const handleViewHistory = () => {
        fetchTransactions();
        setIsModalOpen(true);
    };

    const handleVNPayReturn = async () => {
        const searchParams = new URLSearchParams(location.search);
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
        const vnpAmount = searchParams.get('vnp_Amount');
        const vnpPayDate = searchParams.get('vnp_PayDate');
        const vnpOrderInfo = searchParams.get('vnp_OrderInfo');

        if (vnpResponseCode === '00') {
            try {
                const depositResponse = await axios.post('http://localhost:8080/payment/deposit', null, {
                    params: {
                        amount: vnpAmount,
                        vnpPayDate: vnpPayDate,
                        orderInfo: vnpOrderInfo
                    }
                });

                if (depositResponse.data.status === "ok") {
                    toast.success("Deposit successful")
                    fetchWalletData();
                } else {
                    toast.error("Deposit error")
                }
            } catch (error) {
                console.error('Error finalizing deposit:', error);
                toast.error("Deposit error")
            }
        } else {
            alert('Payment was not successful. Please try again.');
        }
        navigate('/wallet', { replace: true });
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return {
            date: date.toLocaleDateString(undefined, optionsDate),
            time: date.toLocaleTimeString(undefined, optionsTime)
        };
    };

    if (!wallet) {
        return <div>Loading wallet...</div>;
    }

    return (
        <div className="wallet">
            <div className="wallet-card">
                <h2>PET HEALTH CARE WALLET</h2>
                <div className="wallet-info">
                    <p><strong>Name:</strong> {wallet.user.name}</p>
                    <p><strong>Phone:</strong> {wallet.user.phone}</p>
                    <p><strong>Address:</strong> {wallet.user.address}</p>
                    <p><strong>Balance:</strong> ${wallet.balance}</p>
                </div>
                <div className="wallet-actions">
                    <div className="action-group">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Enter amount to deposit"
                        />
                        <button onClick={handleDeposit}>Deposit money into your wallet</button>
                    </div>
                    <div className="action-group">
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount to withdraw"
                        />
                        <button onClick={handleWithdraw}>Withdraw money</button>
                    </div>
                    <button onClick={handleViewHistory}>Transaction History</button>
                </div>
            </div>
            
            <Modal className="lichsu"
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Transaction History"
            >
                <h2>Transaction History</h2>
                {transactions.length === 0 ? (
                    <p>No transactions found.</p>
                ) : (
                    <ul>
                        {transactions.map(transaction => {
                            const { date, time } = formatDateTime(transaction.transactionDate);
                            return (
                                <li key={transaction.transactionId}>
                                    <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
                                    <div className="date-time">
                                        <p className="date"><strong>Date:</strong> {date}</p>
                                        <p className="time"><strong>Time:</strong> {time}</p>
                                    </div>
                                    <p><strong>Amount:</strong> {transaction.amount}</p>
                                    <p><strong>Type:</strong> {transaction.transactionType}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </Modal>
        </div>
    );
};

export default Wallet;

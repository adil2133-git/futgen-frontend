import React, { useState, useEffect } from 'react';
import api from '../api/Axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function YourOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get(
                `/orders?status=${selectedStatus}&sort=${sortBy}`
            );
            setOrders(response.data.data || []);
            setFilteredOrders(response.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchOrders();
    }, [isAuthenticated, selectedStatus, sortBy]);

    

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const getStatusCounts = () => {
        const counts = { all: orders.length };
        statusOptions.filter(o => o.value !== 'all').forEach(o => {
            counts[o.value] = orders.filter(order => order.status === o.value).length;
        });
        return counts;
    };

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8 text-center py-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <button onClick={() => navigate('/login')} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-semibold">
                        Login to Continue
                    </button>
                </div>
            </>
        );
    }

    const statusCounts = getStatusCounts();

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
                    <p className="text-gray-600">View and track your order history</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">Total</h3>
                        <p className="text-2xl font-bold text-red-600">{statusCounts.all}</p>
                    </div>
                    {statusOptions.filter(o => o.value !== 'all').map(s => (
                        <div key={s.value} className="bg-white p-4 rounded-lg shadow border">
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">{s.label}</h3>
                            <p className="text-2xl font-bold text-gray-600">{statusCounts[s.value]}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow border mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Status:</label>
                            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Sort:</label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                        {(selectedStatus !== 'all' || sortBy !== 'latest') && (
                            <button onClick={() => { setSelectedStatus('all'); setSortBy('latest'); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm font-medium ml-auto">
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Orders */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">Loading your orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow border">
                            <p className="text-gray-500 text-lg mb-4">No orders found</p>
                            {selectedStatus === 'all' && (
                                <button onClick={() => navigate('/product')} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold">
                                    Start Shopping
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order._id} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                                            <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{order.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 py-2">
                                                <div className="w-16 h-16 flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={e => { e.target.src = 'https://via.placeholder.com/80x80?text=Image'; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ₹{item.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                                        <p className="text-sm text-gray-600">
                                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                                            {order.shippingAddress?.address}<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}<br />
                                            Phone: {order.shippingAddress?.phone}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-900">Payment Method</span>
                                            <span className="text-sm text-gray-600 capitalize">{order.paymentMethod}</span>
                                        </div>
                                        {order.upiId && (
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm font-medium text-gray-900">UPI ID</span>
                                                <span className="text-sm text-gray-600">{order.upiId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default YourOrders;
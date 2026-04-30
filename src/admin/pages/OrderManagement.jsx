import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/Axios';
import Dashboard from '../components/Dashboard';
import usePagination from '../hooks/usePagination';
import { toast } from 'sonner';
import Pagination from "../components/pagination" 

function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const {
    data: orders,
    loading,
    page,
    setPage,
    pagination,
    setParams,
    refetch  // Add refetch here
  } = usePagination("/admin/order");

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  useEffect(() => {
    setParams({
      search: searchTerm,
      status: selectedStatus,
      sort: sortBy
    });
    setPage(1);
  }, [searchTerm, selectedStatus, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      confirmed: orders.filter(order => order.status === 'confirmed').length,
      shipped: orders.filter(order => order.status === 'shipped').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length
    };
  }, [orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/order/${orderId}`, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      await refetch(); // Changed from fetchOrders to refetch
      toast.success('Order status updated successfully!');
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateEmail = (email, maxLength = 20) => {
    if (!email) return '';
    if (email.length <= maxLength) return email;

    const username = email.split('@')[0];
    const domain = email.split('@')[1];

    if (username.length > maxLength - 5) {
      return `${username.substring(0, maxLength - 8)}...@${domain}`;
    }

    return `${username}@${domain.substring(0, 3)}...`;
  };

  return (
    <Dashboard>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Order Management</h1>
        </div>

        {/* Status Cards - Clickable filters */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-6">
          {statusOptions.map(status => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`bg-white p-3 md:p-4 rounded-lg shadow transition-all duration-200 hover:shadow-md ${selectedStatus === status.value ? 'ring-2 ring-red-500' : ''
                }`}
            >
              <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate">
                {status.label}
              </h3>
              <p className={`text-xl md:text-2xl font-bold ${selectedStatus === status.value ? 'text-red-600' : 'text-gray-600'
                }`}>
                {statusCounts[status.value]}
              </p>
            </button>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number, name, or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="totalHigh">Total High</option>
                <option value="totalLow">Total Low</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <button
                onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSortBy('newest'); }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table/Cards */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500 mt-1">Payment: {order.paymentMethod}</div>
                         </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]" title={order.customerEmail}>
                            {truncateEmail(order.customerEmail)}
                          </div>
                          <div className="text-xs text-gray-500">{order.shippingAddress?.phone}</div>
                         </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items?.length || 0} item(s)
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]" title={order.items?.map(item => item.name).join(', ')}>
                            {order.items?.map(item => item.name).join(', ')}
                          </div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {order.total}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="w-full md:w-auto text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                          >
                            {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet View */}
              <div className="hidden md:block lg:hidden">
                <div className="p-4 space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      {/* First row: Order number and Date */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Order #</div>
                          <div className="text-base font-semibold text-gray-900">{order.orderNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-500">Date</div>
                          <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-500">Customer</div>
                        <div className="text-sm text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500 truncate" title={order.customerEmail}>
                          {truncateEmail(order.customerEmail, 25)}
                        </div>
                      </div>

                      {/* Items and Total in grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Items</div>
                          <div className="text-sm text-gray-900">
                            {order.items?.length || 0} item(s)
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Total</div>
                          <div className="text-sm font-semibold text-gray-900">{order.total}</div>
                        </div>
                      </div>

                      {/* Items list - only show truncated list */}
                      {order.items && order.items.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-medium text-gray-500">Products:</div>
                          <div className="text-xs text-gray-600 truncate" title={order.items.map(item => item.name).join(', ')}>
                            {order.items.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items.length > 2 && `, +${order.items.length - 2} more`}
                          </div>
                        </div>
                      )}

                      {/* Status and Actions */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-500 mb-1">Update Status</div>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden p-3 space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    {/* Top row: Order number and Date */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-medium text-gray-500">Order #</div>
                        <div className="text-base font-semibold text-gray-900">{order.orderNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-500">Date</div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>

                    {/* Customer info compact */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{order.customerName}</div>
                          <div className="text-xs text-gray-500 truncate" title={order.customerEmail}>
                            {truncateEmail(order.customerEmail, 20)}
                          </div>
                        </div>
                        <div className="ml-2 text-right">
                          <div className="text-xs font-medium text-gray-500">Total</div>
                          <div className="text-sm font-semibold text-gray-900">{order.total}</div>
                        </div>
                      </div>
                    </div>

                    {/* Items summary */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Items:</span>
                          <span className="ml-1 text-gray-900">{order.items?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Payment:</span>
                          <span className="ml-1 text-gray-900">{order.paymentMethod}</span>
                        </div>
                      </div>
                      {/* Show first product name if available */}
                      {order.items && order.items.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600 truncate">
                          {order.items[0].name}
                          {order.items.length > 1 && `, +${order.items.length - 1} more`}
                        </div>
                      )}
                    </div>

                    {/* Status and Update - moved to bottom */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Current Status</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-gray-500 mb-1">Change to:</div>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 max-w-[120px]"
                          >
                            {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Simplified Pagination UI using reusable component */}
          <Pagination 
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
            loading={loading}
            itemsCount={orders.length}
          />
        </div>
      </div>
    </Dashboard>
  );
}

export default OrderManagement;
import React, { useState, useEffect } from 'react';
import api from '../../api/Axios';
import Dashboard from '../components/Dashboard';
import usePagination from '../hooks/usePagination';
import { toast } from 'sonner';
import Pagination from "../components/pagination" 

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const {
    data: users,
    loading,
    page,
    setPage,
    pagination,
    setParams,
    refetch
  } = usePagination("/admin/user")

  const statusOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active' },
    { value: 'blocked', label: 'Blocked' }
  ];

  useEffect(() => {
    setParams({
      search: searchTerm,
      status: selectedStatus,
      sort: sortBy
    });

    setPage(1);
  }, [searchTerm, selectedStatus, sortBy]);

  const handleBlockUser = async (userId, currentStatus) => {
    if (currentStatus) {
      if (!window.confirm('Are you sure you want to unblock this user?')) return;
    } else {
      if (!window.confirm('Are you sure you want to block this user?')) return;
    }

    try {
      await api.patch(`/admin/user/${userId}`, { blocked: !currentStatus });
      await refetch();
      toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully!`);
    } catch (error) {
      toast.error('Error updating user status');
    }
  };

  const getUserDisplayName = (user) => {
    return `${user.Fname} ${user.Lname}`.trim();
  };

  const getUserInitials = (user) => {
    return `${user.Fname.charAt(0)}${user.Lname.charAt(0)}`.toUpperCase();
  };

  const active = users.filter(user => !user.blocked).length;
  const blocked = users.filter(user => user.blocked).length;

  const ActionButton = ({ user }) => (
    <button
      disabled={user.role === 'admin'}
      onClick={() => handleBlockUser(user.id, user.blocked)}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        user.role === 'admin'
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : user.blocked
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-red-600 text-white hover:bg-red-700'
      }`}
    >
      {user.role === 'admin' ? 'Admin' : user.blocked ? 'Unblock' : 'Block'}
    </button>
  );

  const Avatar = ({ user, size = 'md' }) => {
    const sizeClass = size === 'lg' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs';
    return (
      <div className={`${sizeClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
        user.blocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
      }`}>
        {getUserInitials(user)}
      </div>
    );
  };

  const StatusBadge = ({ blocked }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      {blocked ? 'Blocked' : 'Active'}
    </span>
  );

  const RoleBadge = ({ role }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {role || 'user'}
    </span>
  );

  const LoadingState = () => (
    <div className="p-8 text-center bg-white rounded-lg shadow text-gray-500">Loading users...</div>
  );

  const EmptyState = () => (
    <div className="p-8 text-center bg-white rounded-lg shadow text-gray-500">No users found</div>
  );

  return (
    <Dashboard>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{pagination?.total || users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600">Active Users</h3>
            <p className="text-2xl font-bold text-green-600">{active}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600">Blocked Users</h3>
            <p className="text-2xl font-bold text-red-600">{blocked}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600">Admins</h3>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(user => user.role === 'admin').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSortBy('name'); }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ── DESKTOP TABLE (xl and above) ── */}
        <div className="hidden xl:block bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <LoadingState />
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar user={user} />
                            <span className="text-sm font-medium text-gray-900">{getUserDisplayName(user)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><RoleBadge role={user.role} /></td>
                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge blocked={user.blocked} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><ActionButton user={user} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ── TABLET CARD (md to xl) ── */}
        <div className="hidden md:block xl:hidden space-y-3">
          {loading ? (
            <LoadingState />
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Avatar user={user} size="lg" />

                  {/* Name + Email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">{getUserDisplayName(user)}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Role + Status badges */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <RoleBadge role={user.role} />
                    <StatusBadge blocked={user.blocked} />
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 pl-2 border-l border-gray-100">
                    <ActionButton user={user} />
                  </div>
                </div>

                {/* ID row */}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">ID: </span>
                  <span className="text-xs text-gray-500 font-mono">{user.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── MOBILE CARD (below md) ── */}
        <div className="block md:hidden space-y-3">
          {loading ? (
            <LoadingState />
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 p-4 pb-3">
                  <Avatar user={user} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{getUserDisplayName(user)}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {user.id}</p>
                  </div>
                  <ActionButton user={user} />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mx-4" />

                {/* Details grid */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 px-0">
                  <div className="flex flex-col items-center py-3 px-2 gap-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Email</span>
                    <span className="text-xs text-gray-700 text-center break-all leading-relaxed">{user.email}</span>
                  </div>
                  <div className="flex flex-col items-center py-3 px-2 gap-1.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Role</span>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="flex flex-col items-center py-3 px-2 gap-1.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
                    <StatusBadge blocked={user.blocked} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Simplified Pagination UI using reusable component */}
        <Pagination 
          pagination={pagination}
          currentPage={page}
          onPageChange={setPage}
          loading={loading}
          itemsCount={users.length}
        />
      </div>
    </Dashboard>
  );
}

export default UserManagement;
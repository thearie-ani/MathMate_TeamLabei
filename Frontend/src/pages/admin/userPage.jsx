import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

import { userApi } from "../../api/userApi.js";
import { Card, PageHeader, SearchBar, selectCls } from "../../components/common/card.jsx";
import DeleteModal from "../../components/common/comfirmDeleteModal.jsx";
import DataTable from "../../components/table/dataTable.jsx";
import { formatDate } from "../../utils/formatDate.js";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", roleFilter],
    queryFn: async () => {
      // BUG FIXED: userApi.getAllUsers(params) already wraps its argument
      // in { params } before calling axios — passing { params: {...} }
      // here double-wrapped it, so role/limit never reached the backend
      // as real query-string values.
      const res = await userApi.getAllUsers({ role: roleFilter || undefined, limit: 100 });
      return res.data.data.users;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message || err.response?.data?.message || "Failed to delete"),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => userApi.updateUser(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err) => toast.error(err.message || err.response?.data?.message || "Failed to update"),
  });

  // This is the piece that was entirely missing: an actual way for an
  // admin to change someone's role. Everything else in this file could
  // work perfectly and "admin can update user to admin" would still be
  // impossible without this.
  const updateRole = useMutation({
    mutationFn: ({ id, role }) => userApi.updateUser(id, { role }),
    onSuccess: (_res, variables) => {
      toast.success(`User is now ${variables.role === "admin" ? "an admin" : "a student"}`);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err) => toast.error(err.message || err.response?.data?.message || "Failed to update role"),
  });

  const columns = useMemo(
    () => [
      {
        header: "User",
        // FIXED: your User model field is "username", not "name" — this
        // was rendering blank for every row.
        accessorKey: "username",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-violet-100
              border border-[#e8e4f8] flex items-center justify-center text-sm font-bold text-violet-600 flex-shrink-0"
            >
              {row.original.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-semibold text-[#1a1535] text-sm">{row.original.username}</p>
              <p className="text-xs text-gray-400">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        header: "Verified",
        accessorKey: "isVerified",
        cell: ({ getValue }) => (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              getValue() ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {getValue() ? "Verified" : "Unverified"}
          </span>
        ),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
          <select
            value={row.original.role}
            onChange={(e) => updateRole.mutate({ id: row.original._id, role: e.target.value })}
            disabled={updateRole.isPending}
            className={`${selectCls} w-32 py-1.5 text-xs ${
              row.original.role === "admin" ? "text-violet-700 font-semibold" : "text-blue-600"
            }`}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        ),
      },
      {
        header: "Joined",
        accessorKey: "createdAt",
        cell: ({ getValue }) => <span className="text-gray-500 text-sm">{formatDate(getValue())}</span>,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/admin/users/${row.original._id}`)}
              className="w-8 h-8 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-500 flex items-center justify-center transition-colors"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [navigate, toggleActive, updateRole]
  );

  const filtered = useMemo(
    () =>
      (data || []).filter(
        (u) => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  return (
    <div className="p-6 max-w-7xl">
      <PageHeader title="Users" subtitle={`${data?.length || 0} total users`} />

      <Card>
        <div className="p-4 border-b border-[#e8e4f8] flex items-center gap-3 flex-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by username or email..." />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={`${selectCls} w-36`}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <p className="text-xs text-gray-400 ml-auto">{filtered.length} results</p>
        </div>
        <DataTable data={filtered} columns={columns} isLoading={isLoading} emptyMessage="No users found" />
      </Card>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        itemName={deleteTarget?.username}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
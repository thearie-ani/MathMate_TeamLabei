
import { useState, useMemo } from "react";
import { useNavigate} from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

import toast from "react-hot-toast";

import {userApi} from "../../api/userApi.js";

import {Card, PageHeader, SearchBar, selectCls} from "../../components/common/card.jsx";
import DeleteModal from "../../components/common/comfirmDeleteModal.jsx";
import DataTable from "../../components/table/dataTable.jsx";
import {formatDate} from "../../utils/formatDate.js";


export default function AdminUsersPage () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", roleFilter],
    queryFn: async () => {
      const res = await userApi.getAllUsers( {
        params: { role: roleFilter || undefined, limit: 100 },
      });
      return res.data.data.users;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries(["adminUsers"]);
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete"),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) =>
      userApi.updateUser(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  const columns = useMemo(() => [
    {
      header: "User",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-violet-100
          border border-[#e8e4f8] flex items-center justify-center text-sm font-bold text-violet-600 flex-shrink-0">
            {row.original.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-semibold text-[#1a1535] text-sm">{row.original.name}</p>
            <p className="text-xs text-gray-400">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Grade",
      accessorKey: "grade",
      cell: ({ getValue }) => <span className="text-sm text-gray-500">{getValue() || "—"}</span>,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ getValue }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          getValue() === "admin"
            ? "bg-violet-100 text-violet-700 border-violet-200"
            : "bg-blue-50 text-blue-600 border-blue-200"
        }`}>
          {getValue()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <button
          onClick={() => toggleActive.mutate({ id: row.original._id, isActive: row.original.isActive })}
          className="flex items-center gap-1.5"
        >
          {row.original.isActive
            ? <ToggleRight size={20} className="text-violet-500" />
            : <ToggleLeft size={20} className="text-gray-300" />
          }
          <span className={`text-xs font-medium ${row.original.isActive ? "text-emerald-600" : "text-gray-400"}`}>
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        </button>
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
            className="w-8 h-8 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-500 
            flex items-center justify-center transition-colors"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => setDeleteTarget(row.original)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 
            flex items-center justify-center transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], [navigate, toggleActive]);

  const filtered = useMemo(() =>
    (data || []).filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ), [data, search]);

  return (
    <div className="p-6 max-w-7xl">
      <PageHeader
        title="Users"
        subtitle={`${data?.length || 0} total users`}
      />

      <Card>
        <div className="p-4 border-b border-[#e8e4f8] flex items-center gap-3 flex-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`${selectCls} w-36`}
          >
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <p className="text-xs text-gray-400 ml-auto">{filtered.length} results</p>
        </div>
        <DataTable
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No users found"
        />
      </Card>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        itemName={deleteTarget?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
import { useEffect, useState } from "react";

import PageHeader from "@/component/PageHeader";
import GeneralTable from "@/component/GeneralTable";
import DeleteDialog from "@/component/DeleteDialog";
import UserForm from "@/component/UserForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import { getUsers, deleteUser } from "@/services/users";

export default function Users() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const role = user?.role;

  const canCreate = ["manager", "admin"].includes(role);

  const canUpdate = ["manager", "admin"].includes(role);

  const canDelete = role === "admin";

  // LOAD USERS
  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data?.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // OPEN CREATE FORM
  function handleCreate() {
    setSelectedUser(null);
    setFormOpen(true);
  }

  // OPEN EDIT FORM
  function handleEdit(user) {
    setSelectedUser(user);
    setFormOpen(true);
  }

  // DELETE DIALOG
  function handleDeleteClick(user) {
    setUserToDelete(user);
    setDeleteOpen(true);
  }

  // DELETE / DEACTIVATE
  async function handleDelete() {
    if (!userToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteUser(userToDelete.user_id);

      await loadData();

      setDeleteOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err?.message || "Failed to deactivate user.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // SEARCH
  const searchValue = search.toLowerCase().trim();

  const filteredUsers = users.filter((user) => {
    return (
      String(user.user_id || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.email || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.role || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.active ? "active" : "inactive")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // TABLE COLUMNS
  const columns = [
    {
      key: "user_id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  // PREPARE TABLE DATA
  const tableUsers = filteredUsers.map((user) => ({
    ...user,
    status: user.active ? "Active" : "Inactive",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users and their roles."
      >
        {canCreate && (
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </PageHeader>

      {/* SEARCH + ERROR */}
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9"
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          Loading users...
        </div>
      ) : (
        <GeneralTable
          columns={columns}
          data={tableUsers}
          getRowId={(user) => user.user_id}
          actions={(user) => (
            <div className="flex justify-end gap-2">
              {canUpdate && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(user)}
                  title="Edit user"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}

              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteClick(user)}
                  title="Deactivate user"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        />
      )}

      {/* USER FORM */}
      <UserForm
        user={selectedUser}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={loadData}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Deactivate User"
        description={
          userToDelete
            ? `Are you sure you want to deactivate "${userToDelete.name}"?`
            : "Are you sure you want to deactivate this user?"
        }
      />
    </div>
  );
}

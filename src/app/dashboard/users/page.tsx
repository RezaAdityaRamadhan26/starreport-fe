'use client';

import { useEffect, useState } from 'react';
import { getUsers, changeUserRole, deleteUser } from '@/services/userService';
import type { User } from '@/lib/types';
import { Users, Trash2, Shield, ShieldCheck, UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((res) => {
      if (res.success && res.data) setUsers(res.data);
    }).catch(() => toast.error('Gagal memuat pengguna')).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: number, role: string) => {
    try {
      const res = await changeUserRole(id, role);
      if (res.success) {
        toast.success(`Role diubah ke ${role}`);
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: role as User['role'] } : u));
      }
    } catch { toast.error('Gagal mengubah role'); }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Yakin hapus pengguna "${username}"?`)) return;
    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success('Pengguna dihapus');
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch { toast.error('Gagal menghapus'); }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'super_admin') return <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />;
    if (role === 'admin') return <Shield className="h-3.5 w-3.5 text-blue-500" />;
    return <UserIcon className="h-3.5 w-3.5 text-muted/80" />;
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, { className: string; label: string }> = {
      super_admin: { className: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Super Admin' },
      admin: { className: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Admin' },
      user: { className: 'bg-background text-muted border-border', label: 'Pengguna' },
    };
    const { className, label } = map[role] || map.user;
    return (
      <span className={`pill border ${className}`}>
        {getRoleIcon(role)} {label}
      </span>
    );
  };

  const RoleToggle = ({ user: u }: { user: User }) => {
    const roles = ['user', 'admin', 'super_admin'] as const;
    const labels = { user: 'User', admin: 'Admin', super_admin: 'SA' };
    return (
      <div className="flex rounded-lg bg-input-bg p-0.5">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => { if (r !== u.role) handleRoleChange(u.id, r); }}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
              u.role === r
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted/80 hover:text-muted'
            }`}
          >
            {labels[r]}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <Users className="h-5 w-5 text-emerald-500" /> Kelola Pengguna
        </h1>
        <p className="mt-1 text-sm text-muted">{users.length} pengguna terdaftar.</p>
      </div>

      <div className="card-base overflow-hidden rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted/80">ID</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted/80">Username</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted/80">Role</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted/80">Ubah Role</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted/80">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 transition-colors hover:bg-background/50">
                <td className="px-6 py-4 text-[13px] text-muted/80">#{u.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-input-bg text-[11px] font-semibold text-muted">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[13px] font-medium text-foreground">{u.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                <td className="px-6 py-4"><RoleToggle user={u} /></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(u.id, u.username)}
                    className="rounded-lg p-2 text-muted/50 transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

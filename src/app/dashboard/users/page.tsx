'use client';

import { useEffect, useState } from 'react';
import { getUsers, changeUserRole, deleteUser } from '@/services/userService';
import type { User } from '@/lib/types';
import { Users, Trash2, Shield, ShieldCheck, UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; username: string } | null>(null);

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

  const triggerDelete = (id: number, username: string) => {
    setUserToDelete({ id, username });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const { id } = userToDelete;
    setDeleteModalOpen(false);
    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success('Pengguna dihapus');
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch { toast.error('Gagal menghapus'); }
    setUserToDelete(null);
  };

  const getRoleIcon = (role: string) => {
    if (role === 'super_admin') return <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#a855f7' }} />;
    if (role === 'admin') return <Shield className="h-3.5 w-3.5" style={{ color: '#3b82f6' }} />;
    return <UserIcon className="h-3.5 w-3.5" style={{ color: 'var(--muted)' }} />;
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, { bg: string; color: string; border: string; label: string }> = {
      super_admin: { bg: 'rgba(168,85,247,0.08)', color: '#a855f7', border: 'rgba(168,85,247,0.2)', label: 'Super Admin' },
      admin: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)', label: 'Admin' },
      user: { bg: 'var(--input-bg)', color: 'var(--muted)', border: 'var(--border)', label: 'Pengguna' },
    };
    const { bg, color, border, label } = map[role] || map.user;
    return (
      <span className="ds-badge" style={{ background: bg, color, borderColor: border }}>
        {getRoleIcon(role)} {label}
      </span>
    );
  };

  const RoleToggle = ({ user: u }: { user: User }) => {
    const roles = ['user', 'admin', 'super_admin'] as const;
    const labels = { user: 'User', admin: 'Admin', super_admin: 'SA' };
    return (
      <div className="ds-role-toggle">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => { if (r !== u.role) handleRoleChange(u.id, r); }}
            className={`ds-role-btn ${u.role === r ? 'ds-role-btn-active' : ''}`}
          >
            {labels[r]}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ds-spinner">
        <div className="ds-spinner-ring" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="ds-page-header">
        <h1 className="ds-page-title ds-page-title-icon">
          <Users className="h-5 w-5" style={{ color: '#10b981' }} /> Kelola Pengguna
        </h1>
        <p className="ds-page-subtitle">{users.length} pengguna terdaftar.</p>
      </div>

      <div className="ds-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Ubah Role</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--muted)' }}>#{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div className="ds-avatar ds-avatar-sm">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{u.username}</span>
                  </div>
                </td>
                <td>{getRoleBadge(u.role)}</td>
                <td><RoleToggle user={u} /></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => triggerDelete(u.id, u.username)}
                    style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted)'; }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Konfirmasi Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete?.username}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
        isDestructive={true}
      />
    </div>
  );
}

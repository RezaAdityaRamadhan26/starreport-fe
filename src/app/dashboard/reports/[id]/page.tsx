'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { getReportDetail, changeReportStatus, deleteReport } from '@/services/reportService';
import { getComments, addComment, deleteComment, editComment } from '@/services/commentService';
import type { Report, Comment } from '@/lib/types';
import { UPLOADS_BASE_URL } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/ConfirmModal';
import {
  ArrowLeft, Calendar, User, Tag, Trash2, Edit2,
  Send, MessageSquare, ChevronDown, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentBody, setEditingCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [deleteReportModalOpen, setDeleteReportModalOpen] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportRes, commentsRes] = await Promise.all([
          getReportDetail(id),
          getComments(id),
        ]);
        if (reportRes.success && reportRes.data) setReport(reportRes.data);
        if (commentsRes.success && commentsRes.data) setComments(commentsRes.data);
      } catch {
        toast.error('Gagal memuat detail laporan');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    try {
      const res = await changeReportStatus(id, status);
      if (res.success) {
        toast.success(`Status diubah ke ${status}`);
        setReport((prev) => prev ? { ...prev, status: status as Report['status'] } : null);
      }
    } catch {
      toast.error('Gagal mengubah status');
    }
    setShowStatusDropdown(false);
  };

  const triggerDeleteReport = () => setDeleteReportModalOpen(true);

  const confirmDeleteReport = async () => {
    setDeleteReportModalOpen(false);
    try {
      const res = await deleteReport(id);
      if (res.success) {
        toast.success('Laporan berhasil dihapus');
        router.push('/dashboard/reports');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Gagal menghapus');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(commentBody, id);
      if (res.success) {
        setCommentBody('');
        toast.success('Komentar ditambahkan');
        const commentsRes = await getComments(id);
        if (commentsRes.success && commentsRes.data) setComments(commentsRes.data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Gagal menambah komentar');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteCommentModalOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (commentToDelete === null) return;
    const commentId = commentToDelete;
    setDeleteCommentModalOpen(false);
    try {
      const res = await deleteComment(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success('Komentar dihapus');
      }
    } catch {
      toast.error('Gagal menghapus komentar');
    }
    setCommentToDelete(null);
  };

  const handleEditComment = async (commentId: number) => {
    if (!editingCommentBody.trim()) return;
    try {
      const res = await editComment(commentId, editingCommentBody);
      if (res.success) {
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, body: editingCommentBody } : c));
        setEditingCommentId(null);
        toast.success('Komentar diperbarui');
      }
    } catch {
      toast.error('Gagal mengedit komentar');
    }
  };

  if (loading) {
    return (
      <div className="ds-spinner">
        <div className="ds-spinner-ring" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="ds-empty" style={{ height: '16rem' }}>
        <p className="ds-empty-text">Laporan tidak ditemukan.</p>
        <button onClick={() => router.back()} className="ds-empty-link">
          ← Kembali
        </button>
      </div>
    );
  }

  const formattedDate = new Date(report.created_at).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const canDelete = (user?.role === 'user' && report.user_id === user.id && report.status === 'pending') || isAdmin;

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back */}
      <button onClick={() => router.back()} className="ds-back-btn">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </button>

      {/* Report Card */}
      <article className="ds-card" style={{ overflow: 'hidden' }}>
        {/* Image */}
        {report.image && (
          <div style={{ height: '16rem', overflow: 'hidden', background: 'var(--input-bg)' }}>
            <img src={`${UPLOADS_BASE_URL}/${report.image}`} alt={report.header} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ padding: '2rem' }}>
          {/* Meta + Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <StatusBadge status={report.status} />
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>{report.header}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                <span className="ds-report-card-meta-item">
                  {report.author_avatar ? (
                    <img src={`${UPLOADS_BASE_URL}/${report.author_avatar}`} className="h-4 w-4 rounded-full object-cover" alt={report.author_name} />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {report.author_name}
                </span>
                <span className="ds-report-card-meta-item"><Calendar className="h-3 w-3" />{formattedDate}</span>
                <span className="ds-report-card-meta-item"><Tag className="h-3 w-3" />{report.category_name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isAdmin && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="ds-pagination-btn"
                    style={{ fontSize: '0.75rem' }}
                    id="change-status-btn"
                  >
                    Ubah Status <ChevronDown className="h-3 w-3" />
                  </button>
                  {showStatusDropdown && (
                    <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.375rem', width: '9rem', overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50 }}>
                      {['pending', 'approved', 'rejected'].map((s) => (
                        <button key={s} onClick={() => handleStatusChange(s)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--input-bg)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                        >
                          <StatusBadge status={s} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {canDelete && (
                <button onClick={triggerDeleteReport} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer' }} id="delete-report-btn">
                  <Trash2 className="h-3 w-3" /> Hapus
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--muted)' }}>{report.body}</p>

          {/* Map */}
          {report.latitude && report.longitude && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 className="ds-report-card-meta-item" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', gap: '0.375rem' }}>
                <MapPin className="h-4 w-4" style={{ color: '#10b981' }} /> Lokasi Kejadian
              </h3>
              <div style={{ borderRadius: '0.75rem', border: '1px solid var(--border)', overflow: 'hidden', padding: '0.25rem', background: 'var(--background)' }}>
                <MapComponent
                  markers={[{
                    id: report.id,
                    latitude: report.latitude,
                    longitude: report.longitude,
                    title: report.header,
                    category: report.category_name
                  }]}
                  height="250px"
                  zoom={15}
                />
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Comments */}
      <div className="ds-card" style={{ padding: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1.5rem' }}>
          <MessageSquare className="h-4 w-4" style={{ color: '#10b981' }} />
          Komentar ({comments.length})
        </h2>

        {/* Comment input */}
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="ds-avatar ds-avatar-md" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
            {user?.profile_picture ? (
              <img src={`${UPLOADS_BASE_URL}/${user.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Tulis komentar..."
              className="auth-input"
              style={{ flex: 1 }}
              id="comment-input"
            />
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className="auth-submit"
              style={{ width: 'auto', padding: '0.5rem 0.875rem', borderRadius: '0.625rem', opacity: (!commentBody.trim() || submitting) ? 0.4 : 1 }}
              id="submit-comment"
            >
              {submitting ? (
                <div className="auth-spinner" style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>

        {/* Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {comments.length === 0 ? (
            <p style={{ padding: '2rem 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--muted)' }}>Belum ada komentar. Jadilah yang pertama!</p>
          ) : (
            comments.map((comment) => {
              const isOwner = user?.id === comment.user_id;
              const isAdminComment = comment.role !== 'user';
              const commentDate = new Date(comment.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              });
              return (
                <div key={comment.id} className={`ds-comment ${isOwner ? 'ds-comment-own' : ''}`}>
                  <div className="ds-avatar ds-avatar-md" style={{
                    background: isAdminComment ? 'rgba(59,130,246,0.08)' : 'var(--input-bg)',
                    color: isAdminComment ? '#3b82f6' : 'var(--muted)',
                  }}>
                    {comment.author_avatar ? (
                      <img src={`${UPLOADS_BASE_URL}/${comment.author_avatar}`} className="h-full w-full object-cover" alt="avatar" />
                    ) : (
                      comment.author?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className={`ds-comment-bubble ${isOwner ? 'ds-comment-bubble-own' : 'ds-comment-bubble-other'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="ds-comment-author">{comment.author}</span>
                      {isAdminComment && (
                        <span className="ds-comment-admin-badge">
                          {comment.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      )}
                      <span className="ds-comment-time">{commentDate}</span>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <textarea
                          value={editingCommentBody}
                          onChange={(e) => setEditingCommentBody(e.target.value)}
                          className="auth-input"
                          style={{ fontSize: '0.8125rem', minHeight: '3.75rem', resize: 'none' }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingCommentId(null)} className="ds-back-btn" style={{ fontSize: '0.75rem' }}>Batal</button>
                          <button onClick={() => handleEditComment(comment.id)} className="auth-submit" style={{ width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem' }}>Simpan</button>
                        </div>
                      </div>
                    ) : (
                      <p className="ds-comment-body">{comment.body}</p>
                    )}
                  </div>
                  <div className="ds-comment-actions">
                    {(isOwner || isAdmin) && (
                      <button onClick={() => triggerDeleteComment(comment.id)} className="ds-comment-action-btn" style={{ color: 'var(--muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                    {isOwner && (
                      <button onClick={() => { setEditingCommentId(comment.id); setEditingCommentBody(comment.body); }} className="ds-comment-action-btn"
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#10b981'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteReportModalOpen}
        title="Konfirmasi Hapus Laporan"
        description="Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDeleteReport}
        onCancel={() => setDeleteReportModalOpen(false)}
        isDestructive={true}
      />
      <ConfirmModal
        isOpen={deleteCommentModalOpen}
        title="Konfirmasi Hapus Komentar"
        description="Apakah Anda yakin ingin menghapus komentar ini?"
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDeleteComment}
        onCancel={() => { setDeleteCommentModalOpen(false); setCommentToDelete(null); }}
        isDestructive={true}
      />
    </div>
  );
}

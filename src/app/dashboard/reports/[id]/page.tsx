'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { getReportDetail, changeReportStatus, deleteReport } from '@/services/reportService';
import { getComments, addComment, deleteComment, editComment } from '@/services/commentService';
import type { Report, Comment } from '@/lib/types';
import { UPLOADS_BASE_URL } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
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

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus laporan ini?')) return;
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

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Hapus komentar ini?')) return;
    try {
      const res = await deleteComment(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success('Komentar dihapus');
      }
    } catch {
      toast.error('Gagal menghapus komentar');
    }
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
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted">Laporan tidak ditemukan.</p>
        <button onClick={() => router.back()} className="text-[13px] font-medium text-emerald-600 hover:text-emerald-700">
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
    <div className="animate-fade-in mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </button>

      {/* Report Card */}
      <article className="card-base overflow-hidden rounded-2xl">
        {/* Image */}
        {report.image && (
          <div className="h-64 overflow-hidden bg-input-bg">
            <img src={`${UPLOADS_BASE_URL}/${report.image}`} alt={report.header} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="p-8">
          {/* Meta + Actions */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <StatusBadge status={report.status} />
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{report.header}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted/80">
                <span className="inline-flex items-center gap-1">
                  {report.author_avatar ? (
                    <img src={`${UPLOADS_BASE_URL}/${report.author_avatar}`} className="h-4 w-4 rounded-full object-cover" alt={report.author_name} />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {report.author_name}
                </span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formattedDate}</span>
                <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{report.category_name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="btn-ghost gap-1.5 rounded-lg px-3 py-1.5 text-[12px]"
                    id="change-status-btn"
                  >
                    Ubah Status <ChevronDown className="h-3 w-3" />
                  </button>
                  {showStatusDropdown && (
                    <div className="animate-slide-down absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                      {['pending', 'approved', 'rejected'].map((s) => (
                        <button key={s} onClick={() => handleStatusChange(s)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-muted transition-colors hover:bg-background">
                          <StatusBadge status={s} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {canDelete && (
                <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-100" id="delete-report-btn">
                  <Trash2 className="h-3 w-3" /> Hapus
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{report.body}</p>

          {/* Map */}
          {report.latitude && report.longitude && (
            <div className="mt-8 space-y-3">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-emerald-500" /> Lokasi Kejadian
              </h3>
              <div className="rounded-xl border border-border bg-background p-1">
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

      {/* Comments — Chat-bubble style */}
      <div className="card-base rounded-2xl p-8">
        <h2 className="mb-6 flex items-center gap-2 text-[15px] font-semibold text-foreground">
          <MessageSquare className="h-4 w-4 text-emerald-500" />
          Komentar ({comments.length})
        </h2>

        {/* Comment input */}
        <form onSubmit={handleAddComment} className="mb-6 flex gap-3">
          <div className="flex h-8 w-8 shrink-0 overflow-hidden items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-600">
            {user?.profile_picture ? (
              <img src={`${UPLOADS_BASE_URL}/${user.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Tulis komentar..."
              className="input-base flex-1"
              id="comment-input"
            />
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className="btn-primary rounded-lg px-3 py-2 disabled:opacity-40"
              id="submit-comment"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>

        {/* Thread */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-muted/80">Belum ada komentar. Jadilah yang pertama!</p>
          ) : (
            comments.map((comment) => {
              const isOwner = user?.id === comment.user_id;
              const isAdminComment = comment.role !== 'user';
              const commentDate = new Date(comment.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              });
              return (
                <div key={comment.id} className={`flex gap-3 ${isOwner ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 overflow-hidden items-center justify-center rounded-full text-[11px] font-bold ${
                    isAdminComment ? 'bg-blue-50 text-blue-600' : 'bg-input-bg text-muted'
                  }`}>
                    {comment.author_avatar ? (
                      <img src={`${UPLOADS_BASE_URL}/${comment.author_avatar}`} className="h-full w-full object-cover" alt="avatar" />
                    ) : (
                      comment.author?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    isOwner
                      ? 'rounded-tr-md bg-emerald-50'
                      : 'rounded-tl-md bg-background'
                  }`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-muted">{comment.author}</span>
                      {isAdminComment && (
                        <span className="rounded-full bg-blue-100 px-1.5 py-px text-[10px] font-semibold text-blue-600">
                          {comment.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      )}
                      <span className="text-[11px] text-muted/80">{commentDate}</span>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editingCommentBody}
                          onChange={(e) => setEditingCommentBody(e.target.value)}
                          className="input-base w-full text-[13px] min-h-[60px]"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingCommentId(null)} className="text-[12px] font-medium text-muted hover:text-foreground">Batal</button>
                          <button onClick={() => handleEditComment(comment.id)} className="btn-primary px-3 py-1 text-[12px] rounded-md">Simpan</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] leading-relaxed text-muted">{comment.body}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 self-center">
                    {(isOwner || isAdmin) && (
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-muted/50 transition-colors hover:text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                    {isOwner && (
                      <button onClick={() => { setEditingCommentId(comment.id); setEditingCommentBody(comment.body); }} className="text-muted/50 transition-colors hover:text-emerald-500">
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
    </div>
  );
}

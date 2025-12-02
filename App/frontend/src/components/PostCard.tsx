import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

const PostCard = ({ post, showActions, onEdit, onDelete }: PostCardProps) => {
  const preview = post.content.text.length > 180
    ? `${post.content.text.slice(0, 177)}...`
    : post.content.text;

  return (
    <article className="flex flex-col rounded-2xl border border-white/60 bg-white/90 p-6 shadow-md shadow-brand-100/50 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="font-semibold text-slate-900">{post.author.username}</span>
        <span aria-hidden="true">•</span>
        <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
      </div>
      <Link to={`/post/${post.slug}`} className="mt-3 text-2xl font-semibold text-slate-900 break-words">
        {post.title}
      </Link>
      <p className="mt-3 text-slate-600 text-sm leading-relaxed break-words line-clamp-4">
        {preview}
      </p>
      {post.content.imageUrl && post.content.imageUrl.length > 0 && (
        <img
          src={post.content.imageUrl[0]}
          alt={post.title}
          className="mt-4 aspect-video w-full rounded-2xl object-cover"
        />
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/post/${post.slug}`}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Read story
        </Link>

        {showActions && (
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => onEdit?.(post)}
              className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-400"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(post)}
              className="rounded-full border border-red-200 px-4 py-2 font-medium text-red-600 transition hover:border-red-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;



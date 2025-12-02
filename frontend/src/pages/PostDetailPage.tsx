import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPostBySlug, deletePostRequest } from '../api/posts';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { useAppSelector } from '../hooks/useStore';

const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const postQuery = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: Boolean(slug),
  });

  const { mutateAsync: deletePost, isPending: deleting } = useMutation({
    mutationFn: deletePostRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
  });

  if (postQuery.isLoading) {
    return <Spinner />;
  }

  if (postQuery.isError || !postQuery.data?.post) {
    return (
      <ErrorState
        title="Post not found"
        message="The requested post could not be found."
        onRetry={() => postQuery.refetch()}
      />
    );
  }

  const { post } = postQuery.data;
  const isAuthor = user?._id === post.author._id;

  const handleDelete = async () => {
    if (!post?._id) return;
    if (!window.confirm('Delete this post permanently?')) return;
    await deletePost(post._id);
  };

  return (
    <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-brand-600">Blog</p>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{post.title}</h1>
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{post.author.username}</span>{' '}
          •{' '}
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        {isAuthor && (
          <div className="flex gap-3 pt-3 text-sm">
            <button
              type="button"
              onClick={() => navigate(`/edit-post/${post._id}`)}
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-600"
            >
              Edit post
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full border border-red-200 px-4 py-2 font-semibold text-red-600 hover:border-red-500 disabled:opacity-60"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {post.content.imageUrl && post.content.imageUrl.length > 0 && (
        <div className="grid gap-4">
          {post.content.imageUrl.map((url) => (
            <img
              key={url}
              src={url}
              alt={post.title}
              className="w-full rounded-xl object-cover shadow-sm"
            />
          ))}
        </div>
      )}

      <p className="whitespace-pre-line break-words text-lg leading-relaxed text-slate-700">
        {post.content.text}
      </p>
    </article>
  );
};

export default PostDetailPage;



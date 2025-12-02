import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, deletePostRequest } from '../api/posts';
import { useAppSelector } from '../hooks/useStore';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const { mutateAsync: deletePost, isPending: deleting } = useMutation({
    mutationFn: deletePostRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const myPosts = useMemo(() => {
    if (!postsQuery.data?.posts || !user) return [];
    return postsQuery.data.posts.filter((post) => post.author._id === user._id);
  }, [postsQuery.data?.posts, user]);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Delete this post permanently?')) return;
    await deletePost(postId);
  };

  if (!user) {
    return (
      <ErrorState
        title="You must be signed in"
        message="We were unable to load your profile."
      />
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-500">Profile</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{user.username}</h2>
        <p className="mt-1 text-slate-600">{user.email}</p>
        <button
          type="button"
          onClick={() => navigate('/create-post')}
          className="mt-4 inline-flex items-center rounded-full bg-[#ff7b5f] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#f96443]"
        >
          Create new post
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Your posts ({myPosts.length})
        </h3>
        {postsQuery.isLoading ? (
          <Spinner />
        ) : postsQuery.isError ? (
          <ErrorState
            message="We could not load your posts."
            onRetry={() => postsQuery.refetch()}
          />
        ) : myPosts.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No posts yet. Share your first article with the community.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {myPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                showActions
                onEdit={(current) => navigate(`/edit-post/${current._id}`)}
                onDelete={(current) => handleDelete(current._id)}
              />
            ))}
          </div>
        )}
        {deleting && <p className="mt-2 text-sm text-slate-500">Deleting...</p>}
      </div>
    </section>
  );
};

export default ProfilePage;


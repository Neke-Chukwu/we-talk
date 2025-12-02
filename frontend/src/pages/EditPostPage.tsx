import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostForm from '../components/PostForm';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { fetchPosts, updatePostRequest } from '../api/posts';
import { useAppSelector } from '../hooks/useStore';
import type { PostPayload } from '../types';

const fetchPostForEdit = async (id: string) => {
  const { posts } = await fetchPosts();
  const post = posts.find((item) => item._id === id);
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  const postQuery = useQuery({
    queryKey: ['post-for-edit', id],
    queryFn: () => fetchPostForEdit(id as string),
    enabled: Boolean(id),
  });

  const post = postQuery.data;

  const isAuthor = useMemo(() => {
    if (!post || !user) return false;
    return post.author._id === user._id;
  }, [post, user]);

  const { mutateAsync: updatePost, isPending, error } = useMutation({
    mutationFn: (payload: { id: string; data: PostPayload }) =>
      updatePostRequest(payload.id, payload.data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/post/${data.post.slug}`);
    },
  });

  if (postQuery.isLoading) {
    return <Spinner />;
  }

  if (postQuery.isError || !post) {
    return (
      <ErrorState
        title="Unable to load post"
        message="We couldn't find the post you're trying to edit."
        onRetry={() => postQuery.refetch()}
      />
    );
  }

  if (!isAuthor) {
    return (
      <ErrorState
        title="Not authorized"
        message="You can only edit posts you created."
      />
    );
  }

  const handleSubmit = async (payload: PostPayload) => {
    await updatePost({ id: id as string, data: payload });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Edit post</h2>
      <p className="mt-1 text-sm text-slate-500">
        Update your content and keep readers informed.
      </p>
      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error instanceof Error ? error.message : 'Failed to update post'}
        </p>
      )}
      <div className="mt-6">
        <PostForm
          initialValues={{
            title: post.title,
            content: post.content.text,
            imageUrls: post.content.imageUrl ?? [],
          }}
          onSubmit={handleSubmit}
          submitting={isPending}
        />
      </div>
    </section>
  );
};

export default EditPostPage;


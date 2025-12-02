import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPostRequest } from '../api/posts';
import type { PostPayload } from '../types';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: createPost, isPending, error } = useMutation({
    mutationFn: createPostRequest,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/post/${data.slug}`);
    },
  });

  const handleSubmit = async (payload: PostPayload) => {
    await createPost(payload);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Create a new post</h2>
      <p className="mt-1 text-sm text-slate-500">
        Share your story with the WeTalk community.
      </p>
      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error instanceof Error ? error.message : 'Failed to create post'}
        </p>
      )}
      <div className="mt-6">
        <PostForm onSubmit={handleSubmit} submitting={isPending} />
      </div>
    </section>
  );
};

export default CreatePostPage;


import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../api/posts';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { useAppSelector } from '../hooks/useStore';

const HomePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        message="We could not load the posts right now."
        onRetry={() => refetch()}
      />
    );
  }

  const [featuredPost, ...otherPosts] = data.posts;

  return (
    <section className="space-y-10">
      <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-brand-100/50 ring-1 ring-black/5 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 text-slate-900">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-500">
              {user ? `Glad you're back, ${user.username}` : 'WeTalk Journal'}
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {user
                ? 'Here is your curated feed of community essays and creative briefs.'
                : 'Thoughtful stories curated for builders, dreamers, and trendsetters.'}
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              {user
                ? 'Pick up where you left off or craft something new for the community.'
                : 'Browse curated essays, career diaries, and creative prompts from the WeTalk community.'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={featuredPost ? `/post/${featuredPost.slug}` : '/'}
                className="flex-1 rounded-full bg-slate-900 px-6 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-slate-800"
              >
                Read the latest issue
              </Link>
              <Link
                to="/create-post"
                className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-400"
              >
                Write a story
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#ffe2d1] via-white to-[#ffdccc] p-6 shadow-lg">
            <div className="absolute inset-x-6 top-6 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              <span>Editors pick</span>
              <span>{featuredPost ? new Date(featuredPost.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <div className="mt-10 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {featuredPost ? featuredPost.title : 'No posts yet — publish your first story.'}
              </h2>
              {featuredPost?.content?.text && (
                <p className="text-slate-600 line-clamp-3">{featuredPost.content.text}</p>
              )}
              <Link
                to={featuredPost ? `/post/${featuredPost.slug}` : '/'}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
              >
                Read more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            {featuredPost?.content?.imageUrl?.[0] && (
              <img
                src={featuredPost.content.imageUrl[0]}
                alt={featuredPost.title}
                className="mt-6 w-full rounded-2xl object-cover shadow-2xl"
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Latest deep dives</h2>
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            View all posts →
          </Link>
        </div>
        {data.posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500">
            No posts yet. Be the first to{' '}
            <span className="font-semibold text-slate-900">share your story</span>.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {otherPosts.length === 0
              ? data.posts.map((post) => <PostCard key={post._id} post={post} />)
              : otherPosts.map((post) => <MiniPostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </section>
  );
};

const MiniPostCard = ({ post }: { post: Post }) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-md shadow-brand-100/40 transition hover:-translate-y-1 hover:shadow-lg">
    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
      {new Date(post.createdAt).toLocaleDateString()}
    </div>
    <Link to={`/post/${post.slug}`} className="text-xl font-semibold text-slate-900">
      {post.title}
    </Link>
    <p className="text-sm text-slate-600 line-clamp-3">{post.content.text}</p>
    <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
      <span>{post.author.username}</span>
      <Link to={`/post/${post.slug}`} className="font-semibold text-slate-900">
        Read →
      </Link>
    </div>
  </article>
);

export default HomePage;



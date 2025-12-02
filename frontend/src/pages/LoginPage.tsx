import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

type LoginValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  useAuthRedirect('/');
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  });

  const {
    mutateAsync: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: loginRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const onSubmit = async (values: LoginValues) => {
    await login(values);
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to continue publishing and managing your posts.
      </p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'Failed to login'}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
          Sign up
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;


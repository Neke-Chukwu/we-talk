import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerRequest } from '../api/auth';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

type RegisterValues = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  useAuthRedirect('/');
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    defaultValues: { username: '', email: '', password: '' },
  });

  const {
    mutateAsync: registerUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: registerRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    await registerUser(values);
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Sign up to WeTalk</h2>
      <p className="mt-2 text-sm text-slate-500">
        Create an account to publish posts and engage with the community.
      </p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

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
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Use at least 6 characters' },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'Registration failed'}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;


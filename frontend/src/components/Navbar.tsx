import { Link, NavLink } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutRequest } from '../api/auth';
import { clearUser } from '../store/features/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  const { mutateAsync: logout, isPending } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      dispatch(clearUser());
      await queryClient.invalidateQueries();
      window.location.href = '/';
    },
  });

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition ${
      isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
    }`;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          WeTalk
        </Link>
        <nav className="flex flex-wrap items-center gap-4">
          <NavLink to="/" className={navLinkClasses} end>
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClasses}>
                {user.username}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 disabled:opacity-60"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClasses}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClasses}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;



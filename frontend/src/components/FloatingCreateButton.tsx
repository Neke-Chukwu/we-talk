import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useStore';

const HIDDEN_PATHS = ['/login', '/register', '/create-post'];

const FloatingCreateButton = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;

  const handleClick = () => {
    if (user) {
      navigate('/create-post');
    } else {
      navigate('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Create a new post"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white shadow-xl shadow-slate-500/40 transition hover:scale-105 hover:bg-slate-800 sm:bottom-8 sm:right-8"
    >
      +
    </button>
  );
};

export default FloatingCreateButton;



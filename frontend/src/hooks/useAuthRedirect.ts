import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useStore';

export const useAuthRedirect = (redirectPath = '/') => {
  const navigate = useNavigate();
  const { user, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, hydrated, navigate, redirectPath]);
};



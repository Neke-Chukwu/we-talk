import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from './Navbar';
import FloatingCreateButton from './FloatingCreateButton';
import { fetchProfile } from '../api/auth';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { markHydrated, setUser } from '../store/features/authSlice';

const Layout = () => {
  const dispatch = useAppDispatch();
  const { hydrated } = useAppSelector((state) => state.auth);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (profileQuery.data?.user) {
      dispatch(setUser(profileQuery.data.user));
    }
    if (!hydrated && (profileQuery.isError || profileQuery.isSuccess)) {
      dispatch(markHydrated());
    }
  }, [
    dispatch,
    hydrated,
    profileQuery.data,
    profileQuery.isError,
    profileQuery.isFetching,
    profileQuery.isSuccess,
  ]);

  return (
    <div className="min-h-screen bg-[#fff7f1]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <FloatingCreateButton />
    </div>
  );
};

export default Layout;


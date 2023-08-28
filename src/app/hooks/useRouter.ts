import { useSearchParams as useNextSearchParams } from 'next/navigation';

export const useRouter = () => {
  if (typeof window === 'undefined') {
    return { query: new URLSearchParams() };
  }
  const query = useNextSearchParams();
  return { query };
};

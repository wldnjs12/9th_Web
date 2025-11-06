import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PAGE_SIZE = 10;

async function fetchPosts({ pageParam = 1 }: { pageParam?: number }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error('네트워크 에러');
  return (await res.json()) as Post[];
}

export default function InfinitePostsAutoJsonPlaceholder() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', PAGE_SIZE],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div style={{ padding: '20px' }}>
      {data?.pages.map((page, idx) => (
        <ul key={idx}>
          {page.map((post) => (
            <li key={post.id}>
              <strong>#{post.id}</strong> {post.title}
            </li>
          ))}
        </ul>
      ))}

      <div ref={sentinelRef} style={{ height: 1 }} />

      <div style={{ textAlign: 'center', color: '#666', padding: 8 }}>
        {isFetchingNextPage
          ? '불러오는 중이에요...'
          : hasNextPage
          ? '스크롤을 내리면 더 가져와요.'
          : '모든 데이터를 불러왔어요!'}
      </div>
    </div>
  );
}

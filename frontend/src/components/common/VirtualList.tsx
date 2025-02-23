import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 3, items.length);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      
      const currentScrollTop = listRef.current.scrollTop;
      setScrollTop(currentScrollTop);

      if (onEndReached) {
        const scrolledDistance = currentScrollTop - lastScrollTop.current;
        const scrollHeight = listRef.current.scrollHeight;
        const scrolledToEnd = (currentScrollTop + containerHeight) / scrollHeight > endReachedThreshold;
        
        if (scrolledDistance > 0 && scrolledToEnd) {
          onEndReached();
        }
      }

      lastScrollTop.current = currentScrollTop;
    };

    listRef.current?.addEventListener('scroll', handleScroll);
    return () => listRef.current?.removeEventListener('scroll', handleScroll);
  }, [containerHeight, onEndReached, endReachedThreshold]);

  return (
    <Box
      ref={listRef}
      sx={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <Box sx={{ height: items.length * itemHeight }}>
        <Box
          sx={{
            position: 'absolute',
            top: startIndex * itemHeight,
            left: 0,
            right: 0
          }}
        >
          {items.slice(startIndex, endIndex).map((item, index) => (
            <Box
              key={startIndex + index}
              sx={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

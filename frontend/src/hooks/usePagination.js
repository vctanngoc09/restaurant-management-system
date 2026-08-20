import { useCallback, useState } from "react";

function usePagination({ initialPage = 0, initialSize = 8 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // =========================
  // UPDATE FROM BACKEND
  // =========================

  const updatePagination = useCallback((pageData) => {
    if (!pageData) {
      return;
    }

    setTotalElements(pageData.totalElements ?? 0);
    setTotalPages(pageData.totalPages ?? 0);

    setFirst(pageData.first ?? true);
    setLast(pageData.last ?? true);

    setHasNext(pageData.hasNext ?? false);
    setHasPrevious(pageData.hasPrevious ?? false);
  }, []);

  // =========================
  // CHANGE PAGE
  // =========================

  const goToPage = useCallback(
    (newPage) => {
      if (newPage < 0) {
        return;
      }

      if (totalPages > 0 && newPage >= totalPages) {
        return;
      }

      setPage(newPage);
    },
    [totalPages],
  );

  // =========================
  // PREVIOUS
  // =========================

  const previousPage = useCallback(() => {
    if (!hasPrevious) {
      return;
    }

    setPage((currentPage) => Math.max(currentPage - 1, 0));
  }, [hasPrevious]);

  // =========================
  // NEXT
  // =========================

  const nextPage = useCallback(() => {
    if (!hasNext) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  }, [hasNext]);

  // =========================
  // CHANGE SIZE
  // =========================

  const changeSize = useCallback((newSize) => {
    setSize(Number(newSize));

    // đổi size thì quay về trang đầu
    setPage(0);
  }, []);

  // =========================
  // RESET
  // =========================

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    size,

    totalElements,
    totalPages,

    first,
    last,

    hasNext,
    hasPrevious,

    setPage: goToPage,

    nextPage,
    previousPage,

    changeSize,
    resetPage,

    updatePagination,
  };
}

export default usePagination;

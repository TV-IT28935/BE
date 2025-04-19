export const parsePaginationQuery = (query = {}) => {
  const {
    page = 1,
    size = 10,
    sortBy = "createdAt",
    order = "desc",
    search = "",
    ...restFilters
  } = query;

  const parsedPage = Math.max(parseInt(page), 1);
  const parsedLimit = Math.max(parseInt(size), 1);
  const skip = (parsedPage - 1) * parsedLimit;
  const sortOrder = order === "asc" ? 1 : -1;

  const sort = { [sortBy]: sortOrder };

  return {
    skip,
    size: parsedLimit,
    page: parsedPage,
    sort,
    search,
    filterQuery: restFilters,
  };
};

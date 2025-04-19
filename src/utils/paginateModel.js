export const paginateModel = async ({
  model,
  filter = {},
  sort = {},
  page = 0,
  size = 10,
}) => {
  const { search, ...filterQuery } = filter;
  const [data, total] = await Promise.all([
    model
      .find({ ...filterQuery, name: search })
      .sort(sort)
      .skip(page)
      .limit(size),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page: Math.floor(page / size),
      size,
      totalPages: Math.ceil(total / size),
    },
  };
};

export const paginateModel = async ({
    model,
    page = 0,
    size = 10,
    isActive = true,
}) => {
    const [content, total] = await Promise.all([
        model
            .find({ isActive: isActive })
            .skip(page * size)
            .limit(size),
        model.countDocuments({ isActive: isActive }),
    ]);

    return {
        content,
        pagination: {
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        },
    };
};

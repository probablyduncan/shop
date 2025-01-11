export const getFirstOfNextMonth = () => new Date(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth() + 1,
    1,
);
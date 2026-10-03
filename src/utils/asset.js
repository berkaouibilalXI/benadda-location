// Path to a file in /public that respects Vite's `base` setting.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

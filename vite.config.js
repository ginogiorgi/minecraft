/**
 * @type {import('vite').userConfig}
 */
export default {
    build: {
        sourcemap: true,
    },
    base: process.env.NODE_ENV === "production" ? "/minecraft/" : "",
};

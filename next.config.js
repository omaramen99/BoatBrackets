const OptimizeThreePlugin = require("@vxna/optimize-three-webpack-plugin");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.glsl$/i,
      use: [
        {
          loader: "raw-loader",
        },
      ],
    });
    config.plugins.push(new OptimizeThreePlugin());

    return config;
  },
  experimental: {
    esmExternals: true,
  },
};

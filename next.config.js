module.exports = {
  assetPrefix: '/Zustand-Demo/',
  basePath : "/Zustand-Demo", 
  webpack: (config, options) => {
    config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        use: ['raw-loader', 'glslify-loader'],
  });

    return config;
  }, 
};
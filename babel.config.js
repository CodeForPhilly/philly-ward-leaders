module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        targets: {
          node: "current",
        },
      },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "transform-object-rest-spread",
  ],
};

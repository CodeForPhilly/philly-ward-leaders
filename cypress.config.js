const  { defineConfig } = require('cypress');

module.exports=defineConfig({
  component: {
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
});

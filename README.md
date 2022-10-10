Testing from a Forked repo


# philly-ward-leaders
Shining a spotlight on the powerful players behind Philadelphia elections. [Demo of v2](http://phillywardleaders.surge.sh/).

Had you heard of all the candidates for judge last time you voted? How about City Council at-Large? When you voted, a neighbor of yours likely handed you a ballot of candidates endorsed by your ward. If you haven’t heard of the candidates, why not take your neighbor’s advice?

These endorsements are determined by Ward Leaders, and have a huge influence over who gets elected in Philadelphia. As powerful and few as they are (69), ward leaders tend to remain behind the scenes and most voters don’t even know who theirs is. This transparency web site aims to bring a level of spotlight to ward leaders that is more proportional to the power they wield.

# Local development

This project currently requires outdated node and npm versions to build.

Use Docker to start up a container that has working versions. The lines with ">"
are in the native shell, the lines with ~ are in Docker.

```bash
# Build and start the Docker container.
>  docker-compose build
>  docker-compose up -d
>  docker-compose exec ward-leaders bash

# Install dependencies in the Docker container
~ npm ci

# In Docker, serve with hot reload at localhost:8080
~ npm start

# Inital load of the app in your browser is slow, fyi.
# The dev server has hot reload - you should see any
# changes reflected in the browser in about a second.
# Use ctrl-C to exit the dev server.

# In Docker, build for production with minification
~ npm run build

# Exit docker and stop the container
~ exit

>  docker-compose down
```

# Technical overview

Philly Ward Leaders is a JavaScript single page application built on the [Vue.js framework](https://vuejs.org/). In addition to its source code, this application is powered by data (about each ward leader and committee person) and some narrative content. In order for this data and content to be easily updated by staff at the [Committee of Seventy](https://seventy.org/), it’s housed in [Contentful](https://www.contentful.com/), a content management SaaS product with a user-friendly editing interface (similar to WordPress, but just the admin half). At runtime, the JavaScript application fetches the content and data necessary to render each page via Contentful’s REST API.

## Concepts

This codebase assumes you’re familiar with the following concepts.

**Ajax and REST APIs**
This application uses a JavaScript concept called [Ajax](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started) (albeit heavily abstracted by libraries) to fetch data from Contentful using their [REST API](https://medium.com/@anupamvarghese/apis-restful-apis-an-introduction-plain-and-simple-6146069f4c2e).

**Node.js and npm**
While this application runs in the browser, completely client-side, [Node.js](https://nodejs.org/en/) is used to compile the application before-hand, and [npm](https://www.npmjs.com/) is used to manage its dependencies.

**Contentful**
Poking around [their website](https://www.contentful.com/) may be enough, but it would be helpful to create a free account and poke around to make sure you understand the concept of a CMS-as-a-Service.

**Webpack**
[Webpack](https://webpack.js.org/) is a tool that aids you in pulling your hair out, building up frustration, and considering leaving front-end development behind for good. You can also use it to combine JavaScript modules into a bundled file that can be run in the browser. In this project it’s also used to run a local development server. Webpack can do *a ton* of things, and one of the trade-offs is that it’s rather confusing to configure and debug.

**Modern JavaScript features**
This application is written in modern JavaScript (ES2015-ES2017) with language features such as [arrow functions](https://github.com/DrkSephy/es6-cheatsheet#arrow-functions), [destructuring](https://github.com/DrkSephy/es6-cheatsheet#destructuring), [object spread operator](https://codeburst.io/master-javascripts-object-spread-operator-3803430e99aa), and [async/await](http://nikgrozev.com/2017/10/01/async-await/). 

**Babel**
[Babel](https://babeljs.io/) allows us to support older browsers by transpiling our modern source code into source code that is more widely supported.

**Vue.js**
We chose this framework because it’s relatively easy to get up-to-speed in, even if you’ve never used a JS framework before. But there are probably a few Vue.js-only things you’ll find yourself scratching your head about if it’s your first Vue.js app. It would be worth reading through their [really great guide](https://vuejs.org/v2/guide/).

**Composing components**
This is a concept that you’ll already know if you’ve used React, Angular, choo, or other modern JS frameworks. If not, you’ll come across it [in the Vue.js guide](https://vuejs.org/v2/guide/#Composing-with-Components). [React’s docs](https://reactjs.org/docs/thinking-in-react.html) are also helpful for the concept.

**Vuex**
We use Vue.js’ official centralized state management library, vuex. If you’re familiar with flux, redux, or elm, this will be pretty recognizable. If it’s your first time with centralized state management, this may be the most complex concept. Read over the [vuex docs](https://vuex.vuejs.org/en/) — specifically “What is vuex?”

**Vue-router**
If you’ve used a router before, whether in JS or a server-side environment, this should seem pretty familiar. But it will be helpful to have the [vue-router docs](https://router.vuejs.org/en/) handy for anything that’s not obvious.

## Directory structure
```
.
├── 200.html -> index.html
├── LICENSE
├── README.md
├── data-scripts
├── package.json
├── public
│   ├── data
│   ├── CNAME
│   ├── index.html
├── src
│   ├── App.vue
│   ├── api
│   ├── assets
│   ├── components
│   ├── config.js
│   ├── main.js
│   ├── router
│   ├── store
│   │   ├── actions.js
│   │   ├── getters.js
│   │   ├── index.js
│   │   └── mutations.js
│   ├── util.js
│   └── views
├── tests
└── webpack.config.js
```

## `src` directory
| **File / directory** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public`             | The directory that gets deployed. It includes the static `index.html` in source control, but the `build` script will put additional (compiled) files into this directory.                                                                                                                                                                                                                                                                                            |
| `public/data`        | Static data files that are requested dynamically by the application (at runtime).                                                                                                                                                                                                                                                                                                                                                                                    |
| `main.js`            | Primary entry point for the app. Initializes router, store, and the top-level Vue component, mounting it to the `#app` element in `index.html`.                                                                                                                                                                                                                                                                                                                      |
| `App.vue`            | Top-level Vue component. Provides the layout for the site, including the nav bar, loading indicator, and space for the current route’s view. Also sets up the site’s core styles.                                                                                                                                                                                                                                                                                    |
| `config.js`          | Configuration values which are **not sensitive**. Any values needed by the app at runtime should be considered “public” in a JavaScript single page app like this.                                                                                                                                                                                                                                                                                                   |
| `util.js`            | Utility functions used in multiple files.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `assets`             | Static assets                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `router`             | Maps URL paths to corresponding views, which are surfaced in the `<router-view>` component of `App.vue`.                                                                                                                                                                                                                                                                                                                                                             |
| `views`              | High-level components representing the “pages” of the app. Views render content, including other components. Views are also components, but what makes them “higher level” is that they represent a larger surface area, are very unlikely to be reused, and typically interact with the app’s store by triggering data fetches and using the store’s state.                                                                                                         |
| `components`         | Low-level components that represent a distinct section, item, or functionality and may be reusable. By convention, components don’t interact with the store. If they need to render a piece of state from the store, the view that composes the component will pass that piece of state to it as a prop. If they need to trigger an action in the store (ie. in response to clicking on the component), the component should emit an event that the view listens to. |
| `store/index.js`     | Initializes the application’s store and defines the pieces of state as well as their initial values.                                                                                                                                                                                                                                                                                                                                                                 |
| `store/actions.js`   | Functions that have side effects (ie. fetching data from a server), and typically save their results to the state by passing it to a mutation.                                                                                                                                                                                                                                                                                                                       |
| `store/mutations.js` | Functions that change (mutate) the state. They’re typically called by actions, but could also be called by views (if no side effect is necessary). Note that Vue updates state mutably because YOLO, but has [a couple minor caveats](https://vuejs.org/v2/guide/reactivity.html) when adding or removing object properties.                                                                                                                                         |
| `store/getters.js`   | Reusable convenience functions for deriving/computing values from the state.                                                                                                                                                                                                                                                                                                                                                                                         |
| `api`                | Abstraction of the actual interactions with servers. These functions are called by actions and could live inside them but are separated for readability.                                                                                                                                                                                                                                                                                                             |
| `data-scripts`       | Handy little python scripts to clean and merge voter turnout and registration data. Also a script to migrate content to contentful. See `data-scripts/README.md` for details.                                                                                                                                                                                                                                                                                        |

# Browser testing
<table><tr>
<td><img width="150" alt="BrowserStack Logo" src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png"></td>
<td>BrowserStack kindly provides free access to their cross-browser testing platform since this is an open source project.</td>
</tr></table>

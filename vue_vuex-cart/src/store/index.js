import { createStore } from 'vuex';
import cartModule from './modules/cart.js';
import productsModule from './modules/products.js';

const store = createStore({
  modules: { cart: cartModule, products: productsModule },

  state() {
    return {
      isLoggedIn: false,
    };
  },

  getters: {
    userIsAuthenticated(state) {
      return state.isLoggedIn;
    },
  },

  mutations: {
    setAuth(state, payload) {
      state.isLoggedIn = payload.isAuth;
    },
  },

  actions: {
    login(context) {
      context.commit('setAuth', { isAuth: true });
    },
    logout(context) {
      context.commit('setAuth', { isAuth: false });
    },
  },
});

export default store;

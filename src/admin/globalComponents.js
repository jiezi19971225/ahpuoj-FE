import TableTools from './components/TableTools/index.vue';

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }
  Vue.component('TableTools', TableTools);
}

export default plugin;

import Vue from 'vue'
import Router from 'vue-router'
import Top from './components/Top.vue'
import QrPrint from './components/QrPrint.vue'
import Order from './components/Order.vue'
import OrderSheet from './components/OrderSheet.vue'
import CategoryMaintenance from './components/CategoryMaintenance.vue'
import GroupMaintenance from './components/GroupMaintenance.vue'
import MenuMaintenance from './components/MenuMaintenance.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'top',
      component: Top
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/qrPrint',
      name: 'qrPrint',
      component: QrPrint
    },
    {
      path: '/orderSheet',
      name: 'orderSheet',
      component: OrderSheet
    },
    {
      path: '/CategoryMaintenance',
      name: 'CategoryMaintenance',
      component: CategoryMaintenance
    },
    {
      path: '/GroupMaintenance',
      name: 'GroupMaintenance',
      component: GroupMaintenance
    },
    {
      path: '/menuMaintenance',
      name: 'MenuMaintenance',
      component: MenuMaintenance
    },
  ]
})
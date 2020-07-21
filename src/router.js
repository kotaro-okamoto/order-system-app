import Vue from 'vue'
import Router from 'vue-router'
import Top from './components/Top.vue'
import QrPrint from './components/QrPrint.vue'
import Order from './components/Order.vue'
import Order1 from './components/Order1.vue'
import Order2 from './components/Order2.vue'
import Order3 from './components/Order3.vue'
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
      path: '/order1',
      name: 'order1',
      component: Order1
    },
    {
      path: '/order2',
      name: 'order2',
      component: Order2
    },
    {
      path: '/order3',
      name: 'order3',
      component: Order3
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
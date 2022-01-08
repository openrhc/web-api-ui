import { createRouter, createWebHashHistory } from 'vue-router'
import Status from '../views/Status.vue'
import System from '../views/System.vue'
import Network from '../views/Network.vue'
import Service from '../views/Service.vue'
import Settings from '../views/Settings.vue'

import ServiceProxy from '../views/Service/Proxy.vue'

const routes = [
  {
    path: '/',
    name: 'Status',
    component: Status
  },
  {
    path: '/system',
    name: 'System',
    component: System
  },
  {
    path: '/network',
    name: 'Network',
    component: Network
  },
  {
    path: '/service',
    name: 'Service',
    component: Service,
    children: [
      {
        path: '/service/proxy',
        component: ServiceProxy
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

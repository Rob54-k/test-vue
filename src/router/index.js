import Vue from 'vue'
import VueRouter from 'vue-router'
import Contact from '../views/contact.vue'
import ContactList from '../views/contact-list.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Contacts',
    component: ContactList
  },
  {
    path: '/contact/:id',
    name: 'Contact',
    component: Contact
  }
]

const router = new VueRouter({
  routes
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AboutView from '../views/AboutView.vue'
import Contact from '../views/Contact.vue'
import ProductScreen from '../views/ProductScreen.vue'
import Calendar from '../components/Calendar.vue'
import ItemScreen from '../views/ItemScreen.vue'
import Additem from '../views/Additem.vue'
import HomeAdmin from '../views/HomeAdmin.vue'
import ItemPreparationScreen from '../views/ItemPreparationScreen.vue'
import Blacklist from '../views/Blacklist.vue'
import UserExtensions from '../views/UserExtensions.vue'
import ManageItems from '../views/ManageItems.vue'
import modifyItemScreen from '../views/modifyItemScreen.vue'
import addKitScreen from '../views/addKitScreen.vue'
import Popup from '../components/Popup.vue'
import options from '../views/options.vue'
import Cart from '../views/Cart.vue'
import MyProducts from '@/views/MyProducts.vue'
import PopupManageItemsScreen from '../components/PopupManageItemsScreen.vue'
import ExtensionPage from '@/views/ExtensionPage.vue'
import Login from '@/views/Login.vue'
import addItemsScreen from '../views/addItemsScreen.vue'
import checkPage from '@/views/checkPage.vue'
import ReportIssue from '../views/ReportIssue.vue'




const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact
  }
  ,
  {
    path: '/productscreen',
    name: 'productscreen',
    component: ProductScreen,
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  },
  {
    path: '/ItemScreen/:Name',
    name: 'ItemScreen',
    component: ItemScreen,
    props: true
  },
  {
    path: '/Additem',
    name: "Additem",
    component: Additem
  },
  { path: '/HomeAdmin',
    name: 'HomeAdmin',
    component: HomeAdmin
  },
  {
    path: '/ItemPreparationScreen',
    name: 'ItemPreparationScreen',
    component: ItemPreparationScreen
  },
  {
    path: '/Blacklist',
    name: 'Blacklist',
    component: Blacklist
  },
  {
    path: '/UserExtensions',
    name: 'UserExtensions',
    component: UserExtensions
  },
  {
    path: '/ManageItems',
    name: 'ManageItems',
    component: ManageItems
  },
  {
    path: '/modifyItemScreen',
    name: 'modifyItemScreen',
    component: modifyItemScreen,
  },
  {
    path: '/addKitScreen',
    name: 'addKitScreen',
    component: addKitScreen,
  },
  {
    path: '/Popup',
    name: 'Popup',
    component: Popup
  },
  {
    path: '/options',
    name: 'options',
    component: options,
  },
  {
    path: '/Myproducts',
    name: 'Myproducts',
    component: MyProducts
  },
  {
    path: '/addItemsScreen',
    name: 'addItemsScreen',
    component: addItemsScreen,
  },
  {
    path: '/ManageItems',
    name: 'ManageItems',
    component: ManageItems
  },
  {
    path: '/ExtensionPage',
    name: 'ExtensionPage',
    component: ExtensionPage
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/checkPage',
    name: 'checkPage',
    component: checkPage
  },
  
  {
    path: '/ReportIssue',
    name: 'ReportIssue',
    component: ReportIssue
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

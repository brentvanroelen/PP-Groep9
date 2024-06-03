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
import changeItemInfo from '@/views/changeItemInfo.vue'
import historyPage from '@/views/historyPage.vue'
import ReportIssue from '@/views/ReportIssue.vue'
import { useUserIdentification } from '@/Pinia/Store'
import { auth, getDoc,getDocs,query,where } from '@/Firebase/Index'
import { DocumentReference } from 'firebase/firestore'


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
    path: '/productscreen/:category?',
    name: 'productscreen',
    component: ProductScreen,
    props: true
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
    component: HomeAdmin,
    meta: {requiresAuth: true}
  },
  {
    path: '/ItemPreparationScreen',
    name: 'ItemPreparationScreen',
    component: ItemPreparationScreen,
    meta: {requiresAuth: true}
  },
  {
    path: '/Blacklist',
    name: 'Blacklist',
    component: Blacklist,
    meta: {requiresAuth: true}

  },
  {
    path: '/UserExtensions',
    name: 'UserExtensions',
    component: UserExtensions,
    meta: {requiresAuth: true}
  },
  {
    path: '/ManageItems',
    name: 'ManageItems',
    component: ManageItems,
    meta: {requiresAuth: true}

  },
  {
    path: '/modifyItemScreen',
    name: 'modifyItemScreen',
    component: modifyItemScreen,
    meta: {requiresAuth: true}

  },
  {
    path: '/addKitScreen',
    name: 'addKitScreen',
    component: addKitScreen,
    meta: {requiresAuth: true}

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
    meta: {requiresAuth: true}

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
    meta: {requiresAuth: true}

  },
  {
    path: '/ManageItems',
    name: 'ManageItems',
    component: ManageItems,
    meta: {requiresAuth: true}

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
    path: '/changeItemInfo',
    name: 'changeItemInfo',
    component: changeItemInfo,
    meta: {requiresAuth: true}

  },
  {
    path: '/historyPage',
    name: 'historyPage',
    component: historyPage,
    meta: {requiresAuth: true}

  },
  {
    path: '/ReportIssue',
    name: 'ReportIssue',
    component: ReportIssue
  },
  
  
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
});


export default router

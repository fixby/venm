import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import login from './components/Login.vue'
import reg from './components/Reg.vue'
import user from './components/User.vue'
import userArticleList from './components/UserArticleList.vue'
import userCategoryArticleList from './components/UserCategoryArticleList.vue'
import userAbout from './components/UserAbout.vue'
import userContact from './components/UserContact.vue'
import userArticle from './components/UserArticle.vue'
import admin from './components/Admin.vue'
import adminArticleList from './components/AdminArticleList.vue'
import adminAddArticle from './components/AdminAddArticle.vue'
import adminCategory from './components/AdminCategory.vue'
import adminAddCategory from './components/AdminAddCategory.vue'
import resetPassword from './components/ResetPassword.vue'

Vue.use(VueRouter);
Vue.use(VueResource);

//routes config
const routes=[
  {path:'/', redirect:'/userArticleList'},
  {path:'/login', component: login, name:'login'},
  {path:'/reg', component: reg, name:'reg'},
  {path: '/user', component: user,
    children:[
      {path:'/userArticleList', component:userArticleList, name:'userArticleList'},
      {path:'/userCategoryArticleList', component:userCategoryArticleList, name:'userCategoryArticleList'},
      {path:'/userArticle', component:userArticle, name:'userArticle'},
      {path:'/userAbout', component:userAbout, name:'userAbout'},
      {path:'/userContact', component:userContact, name:'userContact'}
    ]
  },
  {path: '/admin', component:admin,
    children:[
      {path:'/adminArticleList', component:adminArticleList, name:'adminArticleList'},
      {path:'/adminAddArticle', component:adminAddArticle, name:'adminAddArticle'},
      {path:'/adminCategory', component:adminCategory, name:'adminCategory'},
      {path:'/adminAddCategory', component:adminAddCategory, name:'adminAddCategory'},
      {path:'/resetPassword', component: resetPassword, name:'resetPassword'}
    ]
  }
];

//genartor VueRouter object
const router=new VueRouter({
    mode: 'history',
  routes
});

//bind and render
const app=new Vue({
  router,
  render: h=>h(App)
}).$mount('#app');





<template>
  <div class="blog">
    <div class="blog-masthead">
      <div class="container">
        <nav class="blog-nav">
          <router-link class="blog-nav-item" to="/userArticleList">博文</router-link>
          <router-link class="blog-nav-item" to="/userAbout">关于</router-link>
          <router-link class="blog-nav-item" to="/userContact">联系</router-link>

          <!--<form class="navbar-form navbar-right">-->
            <!--<input type="text" class="form-control" id="keyword" v-model="keyword" placeholder="Search...">-->
          <!--</form>-->
        </nav>
      </div>
    </div>
    <div class="container">
      <div class="row">

        <div class="col-sm-8 blog-main">

          <router-view></router-view>
        </div><!-- /.blog-main -->

        <userSider></userSider>
      </div><!-- /.row -->

    </div><!-- /.container -->
    <userFooter></userFooter>
  </div>
</template>

<script>
import userFooter from './userFooter.vue'
import userSider from './userSider.vue'
//console.log(messages());
export default {

  data () {
    return {
      keyword:'',
    }
  },
  methods:{

  },
  created(){

  },
  components:{
    userFooter,
    userSider
  }
}
</script>

<style scoped src="../css/blog.css">
      body {
        font-family: Georgia, "Times New Roman", Times, serif;
        color: #555;
      }
</style>

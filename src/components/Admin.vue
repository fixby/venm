<template>
    <div style="padding-top:40px">
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <router-link class="navbar-brand" to="/">BlogCms vue&node</router-link>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li @click="logout"><a href="#">{{user ? user.email : 0}} &nbsp; 注销</a></li>
                        <li><a href="javascript:;">_(•̀ω•́ 」∠)_</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container-fluid float-top">
            <div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <admin-nav></admin-nav>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import adminNav from './AdminNav.vue'

export default{
    data(){
        return{
            user:null
        }
    },
    methods:{
        logout(){
            console.log('注销开始操作');
            this.$http.get('/logout').then(function(result){
                this.$router.push('/userArticleList');
            }, function(res){
                this.$router.push('/userArticleList');
            });

        }
    },
    created(){
        this.$http.get('/mysession').then(function(result){
            if(result.status==200){
                console.log(result.body);
                this.user=result.body
            }
        }, function(res){
            console.log('会话失败：'+res.status);
            this.$router.push('/login');
        });
    },
    components:{
        adminNav,
    }
}
</script>
<style scoped src="../css/dashboard.css">

</style>


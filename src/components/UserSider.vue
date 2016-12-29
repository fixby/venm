<template>
    <div>
        <div class="col-sm-3 col-sm-offset-1 blog-sidebar">
            <div class="sidebar-module">
                <h4>文章分类</h4>
                <ol class="list-unstyled">
                    <li v-for="item in categories">
                        <!--<router-link :to="{name:'userCategoryArticleList', query:{id:item._id, slug:item.slug}}" @click="change">{{item.name}}</router-link>-->
                        <a href="javascript:;" @click="change(item._id, item.slug)">{{item.name}}</a>
                    </li>
                </ol>
            </div>
            <div class="sidebar-module">
                <h4>Elsewhere</h4>
                <ol class="list-unstyled">
                    <li><a href="https://github.com/wangzhongjie/">GitHub</a></li>
                    <li><a href="https://twitter.com/wzjcool">Twitter</a></li>
                    <li><a href="https://www.facebook.com/wang.zhonjie">Facebook</a></li>
                </ol>
            </div>
        </div><!-- /.blog-sidebar -->
    </div>
</template>

<script>
export default{
    data(){
        return{
            categories:[]
        }
    },
    methods:{
        //获取所有分类
        getCategories(){
            this.$http.get('/category').then(function(res){
                this.categories = res.body;
            },function(res){
                alert('获取分类失败： '+ res.status);
            });
        },

        change(id, slug){
            this.$router.push({name:'userCategoryArticleList', query:{id:id, slug:slug}});
            window.location.reload();
        }

    },

    created(){
        this.getCategories();
    }
}
</script>

<style scoped src="../css/blog.css">
</style>


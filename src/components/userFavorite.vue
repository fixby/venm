<template>
    <div>
        <h2 class="page-header post-view-header">{{article.title}}</h2>
        <div class="post post-view">
            <div class="post-meta">
                <span class="post-created"><i class="fa fa-calendar"></i>&nbsp; {{article.created}}</span>
                <span class="post-author"><i class="fa fa-user"></i>&nbsp;  {{article.author.name}}</span>
                <span class="post-category"><i class="fa fa-shopping-basket"></i>&nbsp;  {{article.category.name}}</span>
                <span class="post-comment"><i class="fa fa-comment"></i>&nbsp;  {{article.comments.length}}</span>
                <span class="post-favorite">
                    <router-link :to="{name:'userFavorite', query:{id:article.slug}}">
                        <i class="fa fa-star"></i>&nbsp; {{article.meta.favorites}}
                    </router-link>
                </span>
            </div>
            <div class="post-content">{{article.content}}</div>
        </div><!-- /.blog-post -->

        <div class="post-comment">
            <h3>用户评论</h3>
            <div class="post-comment-list">
                <h5 class="post-comment-email">2324234@qq.com</h5>
                <p class="post-comment-content">sdlfkjsdlfksdfkl</p>
            </div>

            <p class="alert alert-info">还没有评论</p>

            <form class="post-comment-form">
                <h3>添加评论</h3>
                <div class="form-group">
                    <label>邮箱</label>
                    <input class="form-control" type="text" placeholder="请输入邮箱..." />
                </div>
                <div class="form-group">
                    <label>内容</label>
                    <textarea class="form-control"></textarea>
                </div>
                <button class="btn btn-primary">提交</button>
            </form>
        </div>

    </div>
</template>
<script>
import moment from 'moment'

export default{
    data(){
        return{
            article:{},
            id:''
        }
    },
    methods:{

        //点赞
        setZan(id){
            this.$http.get('/favorite/'+ id).then(function(res){

            },function(res){
                alert('点赞失败： '+ res.status);
            });
        }
    },
    created(){
        this.id=window.location.search.split('=')[1];

        this.setZan(this.id);
    }
}
</script>
<style scoped src="../css/blog.css">
    @import "../../node_modules/font-awesome/css/font-awesome.css"
</style>

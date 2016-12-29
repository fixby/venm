<template>
    <div>
        <h2 class="page-header post-view-header">{{article.title}}</h2>
        <div class="post post-view">
            <div class="post-meta">
                <span class="post-created"><i class="fa fa-calendar"></i>&nbsp; {{article.created}}</span>
                <span class="post-author"><i class="fa fa-user"></i>&nbsp;  {{article.author ? article.author.name : 0}}</span>
                <span class="post-category"><i class="fa fa-shopping-basket"></i>&nbsp;  {{article.category?  article.category.name : 0}}</span>
                <span class="post-comment"><i class="fa fa-comment"></i>&nbsp;  {{article.comments ? article.comments.length : 0}}</span>
                <span class="post-favorite">
                    <a href="javascript:;" @click="setZan(article._id)"><i class="fa fa-star"></i>&nbsp; {{article.meta ? article.meta.favorites : 0}}</a>
                </span>
            </div>
            <div class="post-content" v-html="article.content"></div>
        </div><!-- /.blog-post -->

        <div class="post-comment">
            <h3>用户评论</h3>
            <ul class="post-comment-list" v-show="article.comments ? article.comments.length!=0 : 0">
                <li v-for="item in article.comments">
                    <h5 class="post-comment-email">
                        {{item.author}}
                        <small class="pull-right">{{item.created}}</small>
                    </h5>
                    <p class="post-comment-content">{{item.content}}</p>
                </li>
            </ul>

            <p class="alert alert-info" v-show="article.comments ? article.comments.length==0 : 0">还没有评论</p>

            <form class="post-comment-form">
                <h3>添加评论</h3>
                <div class="form-group">
                    <label>邮箱</label>
                    <input class="form-control" type="text" v-model="commentAuthor" placeholder="请输入邮箱..." />
                </div>
                <div class="form-group">
                    <label>内容</label>
                    <textarea class="form-control" v-model="commentContent"></textarea>
                </div>
                <a href="javascript:;" class="btn btn-primary" @click="submitComment(id)">提交</a>
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
            id:'',
            commentAuthor:'nodeblog@gmail.com',
            commentContent:'',
        }
    },
    methods:{
        //显示文章
        getArticle(id){
            this.$http.get('/article/'+ id).then(function(res){
                this.article=eval('('+res.body+')');
                this.article.created=moment(this.article.created).format('YYYY-MM-DD HH:MM:SS');
                for(let i=0; i<this.article.comments.length; i++){
                    this.article.comments[i].created=moment(this.article.comments[i].created).format('YYYY-MM-DD HH:MM:SS');
                }
                //console.log('author:'+this.article.meta.favourates);
            },function(res){
                alert('获取这篇文章失败： '+ res.status);
            });
        },

        //点赞
        setZan(id){

            this.$http.get('/favorite/'+ id).then(function(res){
                console.log(res.status);
                if(res.status==200){
                    this.article.meta.favorites=this.article.meta.favorites+1;
                }
            },function(res){
                alert('点赞失败： '+ res.status);
            });
        },

        //提交评论
        submitComment(id){
            this.$http.post('/comment/'+id,{
                author:this.commentAuthor,
                content: this.commentContent,
            }).then(function(res){
                this.article.comments.unshift({
                    author:this.commentAuthor,
                    content: this.commentContent,
                    created: moment(new Date()).format('YYYY-MM-DD HH:MM:SS')
                });
                if(res.status==200) console.log('评论文章成功');
                //this.commentAuthor='';
                this.commentContent='';
            },function(res){
                alert('添加文章失败： '+ res.status);
            });
        }
    },
    created(){
        this.id=window.location.search.split('=')[1];

        this.getArticle(this.id);
    }
}
</script>
<style scoped src="../css/blog.css">

</style>

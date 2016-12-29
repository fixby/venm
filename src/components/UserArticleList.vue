<template>
    <div>
        <h2 class="page-header">全部博文</h2>
        <div class="post" v-for="(article, index) in articles">
            <h3 class="post-title">
                <router-link :to="{name:'userArticle', query:{id:article.slug}}">{{article.title}}</router-link>
            </h3>
            <div class="post-abstract">{{article.content}}</div>
            <div class="post-meta">
                <span class="post-created">时间:&nbsp; {{article.created}}</span>
                <span class="post-author">作者:&nbsp;  {{article.author ? article.author.name : 0}}</span>
                <span class="post-category">分类:&nbsp;  {{article.category ? article.category.name : 0}}</span>
                <span class="post-comment">评论:&nbsp;  {{article.comments.length}}</span>
                <span class="post-favorite">被赞:&nbsp; {{article.meta.favourates}}</span>
                <router-link :to="{path:'/userArticle', query:{id:article._id}}">查看全文</router-link>
            </div>
        </div>

        <nav>
            <ul class="pagination">
                <li v-for="n in pages" :class="{'active':n==curPage}">
                    <a href="javascript:;" @click="getArticleList(n)">{{n}}</a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
import moment from 'moment'
import truncate from 'truncate'

export default{
    data(){
        return{
            articles:[],
            pages:[],
            curPage:1,
            pageCount:Number
            //category:'all',
            //author:'all'
        }
    },
    methods:{
        //获取所有文章
        getArticleList(page){
            this.$http.get('/article?page='+ page).then(function(res){
                //console.log('result:'+JSON.stringify(res.body.result));


                this.pages=[];

                this.articles = res.body.result;
                this.pageCount = res.body.pageCount;
                this.curPage = res.body.curPage;

                //the time&conent has formated
                for(let i=0; i<this.articles.length; i++){
                    this.articles[i].created=moment(this.articles[i].created).format('YYYY-MM-DD');
                    this.articles[i].content=truncate(this.articles[i].content, 140);
                }

                for(var i=0; i<this.pageCount; i++){
                    this.pages.push(i+1);
                }
            },function(res){
                alert('获取文章列表失败： '+ res.status);
            });
        }
    },

    created(){
        this.getArticleList(1);
    }
}
</script>

<style scoped src="../css/blog.css">

</style>
<template>
    <div>
        <h2 class="page-header" v-text="slug"></h2>
        <div class="post" v-for="(article, index) in articles">
            <h3 class="post-title">
                <router-link :to="{path:'/userArticle', query:{id:article._id}}">{{article.title}}</router-link>
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

        <!--<nav>-->
        <!--<ul class="pagination">-->
        <!--<li v-for="n in pages" :class="{'active':n==curPage}">-->
        <!--<a href="javascript:;" @click="getArticleList(n)">{{n}}</a>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</nav>-->
    </div>
</template>
<script>
import moment from 'moment'
import truncate from 'truncate'

export default{
    data(){
        return{
            articles:[],
            //pages:[],
            //curPage:1,
            //pageCount:Number,
            categoryId:'',
            slug:''
            //author:'all'
        }
    },
    methods:{
        //获取所有文章
        getArticleList(id){
            this.$http.get('/category/'+ id).then(function(res){
                console.log('result:'+JSON.stringify(res.body));
                //this.pages=[];

                this.articles = res.body;
                //this.pageCount = res.body.pageCount;
                //this.curPage = res.body.curPage;

                //the time&conent has formated
                for(let i=0; i<this.articles.length; i++){
                    if(this.articles[i].created) {
                        this.articles[i].created=moment(this.articles[i].created).format('YYYY-MM-DD');
                    }
                    if(this.articles[i].content) {
                        this.articles[i].content=truncate(this.articles[i].content, 140);
                    }
                }


            },function(res){
                alert('获取文章列表失败： '+ res.status);
            });
        },

        //Event.$on('my-id', function(id){
        //    this.category=category;
        //    consolg(this.category);
        //});
    },

    created(){
        /*article?author=58235ee8a4e78badde9d1e30
        //article?category=58235f38a4e78badde9d1e31
        //article?author=58235ee8a4e78badde9d1e30&category=58235f38a4e78badde9d1e31
        let search=window.location.search;
        if(search){
            if(search.indexOf('&')!=-1){
                this.category=window.location.search.split('&')[1].split('=')[1];
                this.author=window.location.search.split('&')[0].split('=')[1]
            }else{
                if(search.indexOf('author')!=-1){
                    this.author=window.location.search.split('=')[1];
                    this.category='all'
                }
                if(search.indexOf('category')!=-1){
                    this.author='all';
                    this.category=window.location.search.split('=')[1]
                }
            }
        }else{
            this.category='all';
            this.author='all';
        }*/

        //"?id=58235f7ba4e78badde9d1e34&slug=tools"
        this.categoryId=window.location.search.split('&')[0].split('=')[1];
        this.slug=window.location.search.split('&')[1].split('=')[1];
        this.getArticleList(this.categoryId);
    }
}
</script>

<style scoped src="../css/blog.css">

</style>

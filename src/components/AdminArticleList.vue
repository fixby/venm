<template>
    <div>
        <h2 class="sub-header">文章列表 </h2>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>分类</label>
                <select class="form-control" v-model="category">
                    <option value="">- 选择分类 -</option>
                    <option v-for="item in categories" :value="item._id.toString()">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group">
                <label>作者</label>
                <select class="form-control" v-model="user">
                    <option value="">- 选择作者 -</option>
                    <option v-for="item in users" :value="item._id.toString()">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group">
                <label>关键词</label>
                <input class="form-control" v-model="keyword" type="text" />
            </div>
            <a class="btn btn-info" @click="getArticleList(1, sortby, sortdir, category, user, keyword)">筛选</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th width="30%">
                        <a href="javascript:;" @click="sortList(1, 'title', sortdir, category, user, keyword)">标题
                            <span v-show="showArrow=='title'">{{arrow}}</span></a>
                    </th>
                    <th>
                        <a href="javascript:;" @click="sortList(1, 'category', sortdir, category, user, keyword)">分类
                            <span v-show="showArrow=='category'">{{arrow}}</span></a></th>
                    <th>
                        <a href="javascript:;" @click="sortList(1, 'user', sortdir, category, user, keyword)">作者
                            <span v-show="showArrow=='user'">{{arrow}}</span></a></th>
                    <th>
                        <a href="javascript:;" @click="sortList(1, 'created', sortdir, category, user, keyword)">添加时间
                            <span v-show="showArrow=='created'">{{arrow}}</span></a></th>
                    <th>被赞</th>
                    <th>评论</th>
                    <th>
                        <a href="javascript:;" @click="sortList(1, 'published', sortdir, category, user, keyword)">状态
                            <span v-show="showArrow=='published'">{{arrow}}</span></a></th>
                    <th>管理</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(article,index) in articles">
                    <td>{{article.title}}</td>
                    <td>{{article.category ? article.category.name : 0}}</td>
                    <td>{{article.author ? article.author.name : 0}}</td>
                    <td>{{article.created}}</td>
                    <td>{{article.meta.favorites}}</td>
                    <td>{{article.comments.length}}</td>
                    <td>{{article.published}}</td>
                    <td>
                        <router-link class="btn btn-sm btn-success" :to="{path:'/userArticle', query:{id:article.slug}}">查看</router-link>
                        <router-link class="btn btn-sm btn-info" :to="{path:'/adminAddArticle', query:{id:article._id}}">编辑</router-link>
                        <a href="javascript:;" class="btn btn-sm btn-danger" @click="deleteArticle(article._id, index)">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <nav>
            <ul class="pagination">
                <li v-for="n in pages" :class="{'active':n==curPage}">
                    <a href="javascript:;" @click="getArticleList(n, sortby, followPageSort, category, user, keyword)">{{n}}</a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>
import moment from 'moment'

export default{
    data(){
        return{
            //pagination
            articles:[],
            pages:[],
            curPage:1,
            pageCount:Number,
            //sort
            sortby:'created',
            sortdir:'desc',
            followPageSort:'',
            arrow:'⤓',
            showArrow:'created',
            //filter
            categories:[],
            users:[],
            category:'',
            user:'',
            keyword:''
        }
    },
    methods:{
        //获取所有文章  (1, 'created', 'desc', 'categoryId', 'userId'， 'keyword；')
        getArticleList(page, sortby, sortdir, categoryId, userId, keyword){
            let API='/admin/article?page='+page+'&sortby='+sortby+'&sortdir='+sortdir+'&categoryId='+categoryId+'&userId='+userId+'&keyword='+keyword;
            this.$http.get(API).then(function(res){
                //console.log('result:'+JSON.stringify(res.body.result));

                this.pages=[];

                this.articles = res.body.result;
                this.pageCount = res.body.pageCount;
                this.curPage = res.body.curPage;
                this.showArrow = res.body.sortby;

                //the time&conent has formated
                for(let i=0; i<this.articles.length; i++){
                    this.articles[i].created=moment(this.articles[i].created).format('YYYY-MM-DD HH:MM:SS');
                }

                for(var i=0; i<this.pageCount; i++){
                    this.pages.push(i+1);
                }
            },function(res){
                alert('获取文章列表失败： '+ res.status);
            });
        },

        //删除文章
        deleteArticle(id, index){
            this.$http.delete('/article/' + id).then(function(res){
                if(res.status==200) this.articles.splice(index,1);

                if(this.articles.length<1){
                    this.getArticleList(1, this.sortby, this.sortdir, this.category, this.user, this.keyword);
                }
            }, function(res){
                alert('删除文章列表： '+ res.status);
            });
        },

        //format: sortby(1, 'title', 'desc')
        sortList(page, sortby, sortdir, category, user, keyword){
            this.sortby=sortby;
            if(this.sortdir=='desc'){
                this.arrow='⤓';
                this.sortdir='asc';
                this.followPageSort='desc' //点击翻页和点击那个选项正好相反
            }else{
                this.arrow='⤒';
                this.sortdir='desc';
                this.followPageSort='asc'
            }
            this.getArticleList(page, sortby, sortdir, category, user, keyword);
        },

        //获取所有分类
        getCategories(){
            this.$http.get('/category').then(function(res){
                this.categories = res.body;
            },function(res){
                alert('获取分类失败： '+ res.status);
            });
        },

        //获取所有作者
        getUsers(){
            this.$http.get('/user').then(function(res){
                this.users = res.body;
            },function(res){
                alert('获取作者失败： '+ res.status);
            });
        }

    },
    components:{

    },
    created(){
        this.getArticleList(1, this.sortby, this.sortdir, this.category, this.user, this.keyword);
        this.getCategories();
        this.getUsers();
    }
}
</script>

<template>
    <div>
        <p class="alert alert-danger" v-for="item in errors">{{item.msg}}</p>

        <h2 class="sub-header">添加文章 </h2>
        <form class="vertical-form" method="post">
            <div class="form-group">
                <label>标题</label>
                <input class="form-control input-lg" type="text" v-model="title" placeholder="请输入标题..." />
            </div>
            <div class="form-group">
                <label>分类</label>
                <select class="form-control input-lg" v-model="category">
                    <option value="">- 选择分类 -</option>
                    <option v-for="item in categories" :value="item._id">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group">
                <label>内容</label>
                <textarea rows="10" cols="80" class="form-control" v-model="content"></textarea>
                <!--<textarea name="editor1" id="editor1" rows="10" cols="80"></textarea>-->
            </div>
            <a class="btn btn-primary" @click="add">{{submit}}</a>
        </form>
    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>
export default{
    data(){
        return{
            title:'',
            category:'',
            content:'',
            submit:'',
            id:'',

            categories:[],
            errors:[]    //服务端验证失败的返回
        }
    },
    methods:{
        add(){

            //改
            if(this.id!=''){
                this.$http.put('/article/'+ this.id,{
                    title:this.title,
                    content: this.content,
                    category:this.category,
                }).then(function(res){
                    if(res.status==200) {
                        console.log('修改文章成功');
                        this.$router.push('/adminArticleList');
                    }else{
                        console.log('修改文章失败')
                    }

                },function(res){
                    console.log('修改文章失败： '+ res.status);
                    this.errors=res.body;
                });
            //增
            }else{
                this.$http.post('/article',{
                    title:this.title,
                    content: this.content,
                    category:this.category
                }).then(function(res){
                    if(res.status==200){
                        console.log('添加文章成功');
                        this.$router.push('/adminArticleList');
                    }else{
                        console.log('修改文章失败')
                    }
                },function(res){
                    console.log('添加文章失败，未通过服务端校验'+ res.status);
                    this.errors=res.body;
                });
            }
        },

        //显示要修改的文章
        getModifyArticle(id){
            this.$http.get('/edit/'+ id).then(function(res){
                const article=eval('('+res.body+')');
                this.title=article.title;
                this.content=article.content;

                console.log('cate:'+this.category)
                if(!this.category){
                    this.category=article.category._id; console.log('cate1:'+this.category);
                }
            },function(res){
                alert('获取文章失败： '+ res.status);
            });
        },

        //获取所有分类
        getCategories(){
            this.$http.get('/category').then(function(res){
                this.categories = res.body;
            },function(res){
                alert('获取分类失败： '+ res.status);
            });
        }
    },
    created(){
        this.submit='添加';
        this.id=window.location.search.split('=')[1];
        if(this.id){
            this.submit='修改';
            this.getModifyArticle(this.id);
        }else{
            this.id='';
        }
        this.getCategories();
    }
}
</script>

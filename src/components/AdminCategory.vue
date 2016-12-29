<template>
    <div>
        <h2 class="sub-header">分类列表 </h2>
        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th width="30%">名称</th>
                    <th>别名</th>
                    <th>创建时间</th>
                    <th>管理</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in categories">
                    <td>{{item.name}}</td>
                    <td>{{item.slug}}</td>
                    <td>{{item.created}}</td>
                    <td>
                        <router-link class="btn btn-sm btn-success" :to="{name:'userCategoryArticleList', query:{id:item._id, slug:item.slug}}">查看</router-link>
                        <router-link class="btn btn-sm btn-info" :to="{path:'/adminAddCategory', query:{id:item._id}}">编辑</router-link>
                        <!--<a href="javascript:;" class="btn btn-sm btn-danger" @click="deleteCategory(item._id, index)">删除</a>-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>
import moment from 'moment'

export default{
    data(){
        return{
            categories:[],
        }
    },
    methods:{

        //删除分类
        deleteCategory(id, index){
            this.$http.delete('/category/' + id).then(function(res){
                if(res.status==200) this.categories.splice(index,1);

            }, function(res){
                alert('删除分类列表失败： '+ res.status);
            });
        },


        //获取所有分类
        getCategories(){
            this.$http.get('/category').then(function(res){
                this.categories = res.body;
                for(let i=0; i<this.categories.length; i++){
                    this.categories[i].created=moment(this.categories[i].created).format('YYYY-HH-DD HH:MM:DD');
                }
            },function(res){
                alert('获取分类失败： '+ res.status);
            });
        }
    },
    components:{

    },
    created(){
        this.getCategories();
    }
}
</script>

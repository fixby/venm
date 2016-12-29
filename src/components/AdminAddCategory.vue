<template>
    <div>
        <p class="alert alert-danger" v-for="item in errors">{{item.msg}}</p>

        <h2 class="sub-header">添加分类 </h2>
        <form class="vertical-form">
            <div class="form-group">
                <label>分类名称</label>
                <input class="form-control input-lg" type="text" v-model="name" placeholder="请输入分类名称..." />
            </div>
            <a class="btn btn-primary" @click="add">发布</a>
        </form>
    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>
export default{
    data(){
        return{
            name:'',
            id:'',

            errors:[]    //服务端验证失败的返回
        }
    },
    methods:{
        add(){
            //改
            if(this.id!=''){
                this.$http.put('/category/'+ this.id,{
                    name:this.name,
                }).then(function(res){
                    if(res.status==200) {
                        console.log('修改分类成功');
                        this.$router.push('/adminCategory');
                    }else{
                        console.log('修改分类失败')
                    }
                },function(res){
                    console.log('修改分类失败： '+ res.status);
                    this.errors=res.body;
                });
            //增
            }else{
                this.$http.post('/category',{
                    name:this.name,
                }).then(function(res){
                    if(res.status==200){
                        console.log('添加分类成功');
                        this.$router.push('/adminCategory');
                    }else{
                        console.log('添加分类失败')
                    }
                },function(res){
                    console.log('添加分类失败，未通过服务端校验'+ res.status);
                    this.errors=res.body;
                });
            }
        },

        //显示要修改的分类
        getModifyCategory(id){
            this.$http.get('/category/edit/'+ id).then(function(res){
                const category=eval('('+res.body+')');
                console.log(category);
                this.name=category.name;
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
            this.getModifyCategory(this.id);
        }else{
            this.id='';
        }
    }
}
</script>

<template>
    <div>
        <p class="alert alert-danger" v-for="item in errors">{{item.msg}}</p>

        <h2 class="sub-header">修改密码 </h2>
        <form class="vertical-form">
            <div class="form-group">
                <label>新密码</label>
                <input class="form-control input-lg" type="password" v-model="password" placeholder="输入新密码..." />
            </div>
            <div class="form-group">
                <label>重复密码</label>
                <input class="form-control input-lg" type="password" v-model="comfirmPassword" placeholder="输入新密码..." />
            </div>
            <a class="btn btn-primary" @click="modify">修改</a>
        </form>
    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>

export default{
    data(){
        return{
            password:'',
            comfirmPassword:'',
            errors:[],
            user:null
        }
    },
    methods:{
        modify(){
            this.$http.post('/password',{
                password: this.password,
                comfirmPassword: this.comfirmPassword,
                user: this.user
            }).then(function(res){
                if(res.status==200){
                    alert('this pwd was modified succsee');
                     this.password='';
                     this.comfirmPassword=''
                }
            }, function(res){
                alert('密码修改失败： '+ res.status);
                console.log(res.body);
            });
        }
    },
    created(){
        this.$http.get('/mysession').then(function(result){
            if(result.status==200){
                //console.log(result.body);
                this.user=result.body
            }
        }, function(res){
            console.log('会话失败：'+res.status);
            this.$router.push('/login');
        });
    }
}
</script>

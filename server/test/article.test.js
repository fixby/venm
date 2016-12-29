'use strict';

const expect = require('chai').expect;
const fetch = require('node-fetch');

const rooturl = 'http://localhost:3300';
const header = { 'Content-type': 'application/json' };

let id = '';


describe('Article测试', () => {
    it('增加Article测试', () => {
        // 请填写增加对象let body = {name:"fixby@qq.com",password:"admin"};
        const body = { "title": "test", "content": "testcontent" };
        return fetch(rooturl.concat('/article'), { method: 'post', headers: header, body: JSON.stringify(body) }).then((res) => {
            return res.json();
        }).then((json) => {
            // console.log(json);
            id = json.data._id;
            expect(json.status.msg).to.be.deep.equal('create success!');
        });
    });



    it('根据ID获取Article', () => {
        return fetch(rooturl.concat('/article/' + id)).then((res) => {
            return res.json();
        }).then((json) => {
            console.log(json);
            expect(json.data).to.not.be.undefined;
        });
    });

    it('根据ID修改Article', () => {
        // 请填写修改对象let body = {name:"admin@yuanku.org",password:"admin"};
        const body = { "title": "edit_title", "content": "edit_content" };
        return fetch(rooturl.concat('/article/' + id), { method: 'patch', headers: header, body: JSON.stringify(body) }).then((res) => {
            return res.json();
        }).then((json) => {
            // console.log(json);
            expect(json.status.msg).to.be.deep.equal('update success!');
        });
    });

    it('根据ID删除Article', () => {
        return fetch(rooturl.concat('/article/' + id), { method: 'delete' }).then((res) => {
            return res.json();
        }).then((json) => {
            // console.log(json);
            expect(json.status.msg).to.be.deep.equal('delete success!');
        });
    });

    it('查询Article', () => {
        return fetch(rooturl.concat('/article')).then((res) => {
            return res.json();
        }).then((json) => {
            // console.log(json);
            expect(json).to.not.be.empty;
        });
    });
});
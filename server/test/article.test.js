'use strict';

const expect = require('chai').expect;
const fetch = require('node-fetch');

const rooturl = 'http://127.0.0.1:3300';
const header = { 'Content-type': 'application/json' };

const id = 0


describe('Article测试', () => {
    it('增加Article测试', () => {
        // 请填写增加对象let body = {name:"admin@yuanku.org",password:"admin"};
        const body = { "title": "test", "content": "testcontent" };
        return fetch(rooturl.concat('/article'), { method: 'post', headers: header, body: JSON.stringify(body) }).then((res) => {
            return res.json();
        }).then((json) => {
            // console.log(json);
            expect(json).to.be.deep.equal({ status: { code: 0, msg: 'create success!' } });
        });
    });
});


it('根据ID获取Article', () => {
    return fetch(rooturl.concat('/article/5861dcd0293425128fae2844')).then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
        expect(json.data).to.not.be.undefined;
    });
});

it('根据ID修改Article', () => {
    // 请填写修改对象let body = {name:"admin@yuanku.org",password:"admin"};
    const body = { "title": "edit_title", "content": "edit_content" };
    return fetch(rooturl.concat('/article/5861dcd0293425128fae2844'), { method: 'patch', headers: header, body: JSON.stringify(body) }).then((res) => {
        return res.json();
    }).then((json) => {
        // console.log(json);
        expect(json).to.be.deep.equal({
            status: { code: 0, msg: 'update success!' },
            data: { redirect: '/article/5861dcd0293425128fae2844' }
        });
    });
});

it('根据ID删除Article', () => {
    return fetch(rooturl.concat('/article/5861dcd0293425128fae2844'), { method: 'delete' }).then((res) => {
        return res.json();
    }).then((json) => {
        // console.log(json);
        expect(json).to.be.deep.equal({ status: { code: 0, msg: 'delete success!' } });
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
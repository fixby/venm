'use strict';

const expect = require('chai').expect;
const fetch = require('node-fetch');

const rooturl = 'http://localhost:3300';
const header = { 'Content-type': 'application/json' };

let id = '';


describe('Test测试', () => {
      it('增加Test测试', () => {
          // 请填写增加对象let body = {name:"fixby@qq.com",password:"admin"};
          const body = { "title": "test", "content": "testcontent" };
          return fetch(rooturl.concat('/test'), { method: 'post', headers: header, body: JSON.stringify(body) }).then((res) => {
              return res.json();
          }).then((json) => {
              // console.log(json);
              id = json.data._id;
              expect(json.status.msg).to.be.deep.equal('create success!');
          });
      });



  it('根据ID获取Test', () => {
      return fetch(rooturl.concat('/test/'+id)).then((res) => {
          return res.json();
      }).then((json) => {
          console.log(json);
          expect(json.data).to.not.be.undefined;
      });
  });

  it('根据ID修改Test', () => {
      // 请填写修改对象let body = {name:"admin@yuanku.org",password:"admin"};
      const body = { "title": "edit_title", "content": "edit_content" };
      return fetch(rooturl.concat('/test/'+id), { method: 'patch', headers: header, body: JSON.stringify(body) }).then((res) => {
          return res.json();
      }).then((json) => {
          // console.log(json);
          expect(json.status.msg).to.be.deep.equal('update success!');
      });
  });

  it('根据ID删除Test', () => {
      return fetch(rooturl.concat('/test/'+id), { method: 'delete' }).then((res) => {
          return res.json();
      }).then((json) => {
          // console.log(json);
          expect(json.status.msg).to.be.deep.equal('delete success!');
      });
  });

  it('查询Test', () => {
      return fetch(rooturl.concat('/test')).then((res) => {
          return res.json();
      }).then((json) => {
          // console.log(json);
          expect(json).to.not.be.empty;
      });
  });
});
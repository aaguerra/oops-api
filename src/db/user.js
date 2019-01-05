const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//https://github.com/ex90rts/koa-mongoose/blob/master/controllers/user.js
const User = new Schema({
  //'_id'        : {type: Schema.Types.ObjectId, auto: true },
  '_id'        : {type: String },
  "username": { type: String, index: {unique: true, dropDups: true} },
  "password": { type: String, match: /\w+/, index: true },
  //"email": {type: String, default: null},
  "created": { type: Date, default: Date.now, index: true },
  "updated": { type: Date, default: Date.now, index: true },
});

//使用setter，将用户输入的明文密码sha1之后存储
User.path('password').set(function(v){
  let shasum = crypto.createHash('sha1');
  shasum.update(v);
  return shasum.digest('hex');
});

/*User.path('_id').get(function(v){
  console.log('---------------------')
  console.log(typeof  v)
  return this.toJSON()._id;
});*/

//使用middleware，每次保存都记录一下最后更新时间
User.pre('save', function(next){
  this.updated = Date.now();
  next();
});

//静态方法，按用户名查找，因为username加了唯一索引，
//所以这里用的是findOne，只查询一条数据
User.statics.findByUsername = function(username){
  return this.findOne({username: username});
};

//静态方法，按角色查找
User.statics.findByRoles = function(roles){
  if (!Array.isArray(roles)){
      roles = [roles];
  }
  return this.find({roles:{$in:roles}});
};

//静态方法，按负责的杂志查找
User.statics.findByMagazine = function(magazine){
  return this.find({"magazines.name": magazine});
};

//静态方法，按负责的杂志类型查找
User.statics.findByMagazineType = function(magazineType){
  return this.find({"magazines.type": magazineType});
};

//静态方法，查找(一个)没有被雇佣(即不是编辑、也不是作者)的人
User.statics.findJobless = function(){
  return this.findOne({roles:{$nin:["editor", "author"]}});
};

//实例方法，判断是否是编辑
User.methods.isEditor = function(){
  return this.roles.indexOf("editor")!==-1;
};

//创建模型
const model = mongoose.model('User', User);

module.exports = model;
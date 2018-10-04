const {getUserId} = require('../utils/utils');

async function users(parent,args,context,info) {
    return context.db.query.users({},info)
}

async function posts(parent,args,context,info) {
    return context.db.query.postses({},info)
}


async function comments(parent,args,context,info) {
    return context.db.query.commentses({},info)
}

async function likes(parent,args,context,info) {
    return context.db.query.likeses({},info)
}

async function post_likes(parent,args,context,info) {
    return context.db.query.likeses({where:{post:{id:args.post_id}}},info)
}

async function user_posts(parent,args,context,info) {
    let user = getUserId(context);
    return context.db.query.postses({where:{user:{id:user}}},info)
}

async function user_comments(parent,args,context,info) {
    let user = getUserId(context);
    return context.db.query.commentses({where:{user:{id:user}}},info)
}

async function user_followers(parent,args,context,info) {
    let user = getUserId(context);
    return context.db.query.followerses({where:{follower:{id:user}}},info)
}

async function user_followed(parent,args,context,info) {
    let user = getUserId(context);
    return context.db.query.followerses({where:{followed:{id:user}}},info)
}






module.exports = {
    users,
    user_posts,
    posts,
    user_comments,
    comments,
    likes,
    post_likes,
    user_followers,
    user_followed
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {APP_SECRET} = require("../const");
const {getUserId} = require('../utils/utils');

const getID =  `{ id }`;

const queryUser = `{
    id,
    email,
    nickname,
    birth_date,
    biography,
    photo_profile
}`;


async function signup(parent,args,context,info) {
    const password = await bcrypt.hash(args.password,10);

    const user  = await context.db.mutation.createUser(
        {data:{...args,password},queryUser}
    );

    const token = await jwt.sign({userId:user.id},APP_SECRET);


    return {
        token,
        user
    }
}

async function login(parent,args,context,info){

    const user = await context.db.query.user({
        where:{email:args.email}
    });

    if(!user) throw new Error("Not such user find");

    console.log(user.password,args.password);
    const validPassword =  await bcrypt.compare(args.password,user.password);
    console.log(validPassword);
    if(!validPassword) throw new Error("Invalid password");

    const token = await jwt.sign({userId:user.id},APP_SECRET);

    return {
        token,
        user
    }

}


const queryPosts = `{
    id,
    title,
    photo,
    user{
        nickname,
        email
    }
}`;

async function addPost (parent,args,context,info){
    let user_id = getUserId(context);
    let newPost =  await context.db.mutation.createPosts({data:{
            user:{
                connect:{
                    id:user_id
                }
            },
            title:args.title,
            photo:args.photo
        }},queryPosts);
    return newPost
}


const queryFollowers = `{
    id,  
    followed{
        nickname
    }
}`;

async function addFollower (parent,args,context,info){
    let user_id = getUserId(context);
    let newFollower =  await context.db.mutation.createFollowers({data:{
            follower:{
                connect:{
                    id:args.user_followed_id
                }
            },
            followed:{
                connect:{
                    id:user_id
                }
            }
        }},queryFollowers);
    return newFollower
}

const queryComments = `{
    id,
    comment,
    post{
        title,
        photo
    }
    user{
        nickname
        email
    }
}`;

async function addComment (parent,args,context,info){
    let user_id = getUserId(context);
    let newComment =  await context.db.mutation.createComments({data:{
            user:{
                connect:{
                    id:user_id
                }
            },
            post:{
                connect:{
                    id:args.post_id
                }
            },
            comment:args.comment,
        }},queryComments);
    return newComment
}

const queryLike = `{
    id,
    post{
        title,
        photo
    }
    user{
        nickname
        email
    }
}`;

async function addLike (parent,args,context,info){
    let user_id = getUserId(context);
    let newLike =  await context.db.mutation.createLikes({data:{
            user:{
                connect:{
                    id:user_id
                }
            },
            post:{
                connect:{
                    id:args.post_id
                }
            }
        }},queryLike);
    return newLike
}


async function updateUser(parent,args,context,info){
    let user_id = getUserId(context);
    if(args.password) args.password = await bcrypt.hash(args.password,10);


    let updatedUser =  await context.db.mutation.updateUser({
        data:{...args},where:{
            id:user_id
        }
    });

    return updatedUser

}


module.exports = {
    signup,
    login,
    updateUser,
    addPost,
    addComment,
    addLike,
    addFollower
};

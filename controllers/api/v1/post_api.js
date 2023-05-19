const Comment = require("../../../models/comment");
const Post = require("../../../models/post");

module.exports.index = async function(req,res){


    let posts = await Post.find({})
    .sort('-createdAt')
    .populate({
        path: 'user',
        select: '-password -email'
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: '-password -email'
        }
    })

    return res.json(200,{
        message: 'List of posts',
        posts: posts
    })
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        //if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});


            return res.json((200),{
                message: 'Post and associated comments deleted!'
            })

           // req.flash('success', 'Post and associated comments deleted!');

           // return res.redirect('back');
        // }else{
        //     req.flash('error', 'You cannot delete this post!');
        //     return res.redirect('back');
        // }

    }catch(err){
        //req.flash('error', err);
        return res.json(500,{
            message: 'Internal Server Error'
        })
    }
    
}
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
                // handle error

                post.comments.push(comment);
                post.save();
                
                if (req.xhr){
                    return res.status(200).json({
                        data: {
                            comment: comment
                        }, 
                        message: "Comment added!"
                    });
                }
                req.flash('success','Comment added successfully')
                res.redirect('/');
            };
        }

    catch(err){
        req.flash('error','Error while adding comment')
        console.log('Error',err);
        return;
    }
}

//to delete comments
module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        // .id means converting the object id into string
        if (comment.user == req.user.id){

            let postId = comment.post;
            
            comment.remove();
            if (req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
    
            let post = await Post.findByIdAndUpdate(postId,{$pull: {$comments: req.params.id}})
            req.flash('success','Comment deleted successfully')
                return res.redirect('back');
            }
        else{
            req.flash('success','Error while deleting comment')
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('success','Error while deleting comment')
        console.log('Error',err);
        return;
    }
}
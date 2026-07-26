var mongoose = require('mongoose');

const blogSchema  = new mongoose.Schema(
    {
        // user_id: {
        //     type: mongoose.Schema.Types.ObjectId, 
        //     ref: 'User', 
        //     // required: true,
        //     default: "" 
        // }, 
        slug_url:{
            type: String,
        },
        blog_title: {
            type: String,
            required: true
        }, 
        blog_description: {
            type: String,
            required: true
        }, 
        blog_image: {
            type: String,
            // required: true
        },
        meta_keywords: {
            type: [String],
            default: []
        },
        meta_title: {
            type: String,
            default: ""
        },
        meta_description: {
            type: String,
            default: ""
        },
        canonical_url: {
            type: String,
            default: ""
        }, 
        status: {
            type: String,
            default: 'active'
        }, 
        created_at: {
            type: Date, 
            default: Date.now
        }, 
        updated_at: {
            type: Date, 
            default: Date.now
        }, 
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
    }
); 

module.exports = mongoose.model('blog', blogSchema); 

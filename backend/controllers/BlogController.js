const User = require('../models/UserModel');
const Admin = require("../models/AdminModel");
const path = require("path");
const blogModel = require('../models/BlogModel');

exports.createBlog = async (req, res) => {
    const {
        blog_title,
        slug_url,
        blog_description,
        blog_image,
        meta_keywords,
        meta_title,
        meta_description,
        canonical_url
    } = req.body;

    if (!blog_title) {
        return res.status(400).json({
            success: false,
            message: 'Please enter blog title.'
        });
    }
    if (!blog_description) {
        return res.status(400).json({
            success: false,
            message: 'Please enter blog description.'
        });
    }
    try {
        const blogData = await blogModel.findOne({ blog_title: blog_title });
        if (blogData) {
            return res.status(400).json({
                success: false,
                message: 'Blog title already exists.'
            });
        }

        const newData = new blogModel({
            blog_title,
            slug_url,
            blog_description,
            blog_image,
            meta_keywords,
            meta_title,
            meta_description,
            canonical_url
        });

        const savedData = await newData.save();
        return res.status(200).json({
            success: true,
            message: 'Blog added successfully',
            data: savedData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// exports.getBlogById = async (req, res) => {
//     try {
//         if (!req.query.id) {
//             return res.status(400).json({
//                 success: false,
//                 messages: 'Please enter blog id.'
//             });
//         }
//         const blogData = await blogModel.findById(req.query.id);
//         if (!blogData) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Blog not found.'
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             data: blogData
//         });
//     } catch (error) {
//         console.log({ error });
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

exports.getBlogById = async (req, res) => {
    try {
      const { id, slug_url } = req.query; // Fetch `id` or `slug_url` from the query
  
      if (!id && !slug_url) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either a blog ID or slug URL.',
        });
      }
  
      // Query the database by `_id` or `slug_url`
      const blogData = await blogModel.findOne({
        $or: [{ _id: id }, { slug_url: slug_url }],
      });
  
      if (!blogData) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found.',
        });
      }
  
      return res.status(200).json({
        success: true,
        data: blogData,
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

exports.getAllBlog = async (req, res) => {
    try {
        const blogData = await blogModel.find().sort({ created_at: -1 });
        const totalCount = await blogModel.countDocuments(); 
        if (!blogData) {
            return res.status(400).json({
                success: false,
                message: 'No blog found.'
            });
        }
        return res.status(200).json({
            success: true,
            data: blogData,
            count: totalCount
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.getAllActiveBlog = async (req, res) => {
    try {
        const blogData = await blogModel.find({ status: 'active' }).sort({ created_at: -1 });;
        if (!blogData) {
            return res.status(400).json({
                success: false,
                message: 'No blog found.'
            });
        }
        return res.status(200).json({
            success: true,
            data: blogData
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// exports.updateBlog = async (req, res) => {

//     try {

//         if (!req.query.id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Blog id is required.'
//             });
//         }

//         const blogData = await blogModel.findById(req.query.id);
//         if (!blogData) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Blog not Found.'
//             });
//         }
//         const updatedBlog = await blogModel.findByIdAndUpdate(
//             req.query.id,
//             req.body,
//             { new: true },
//         );
//         return res.status(200).json({
//             success: true,
//             data: updatedBlog
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };


exports.updateBlog = async (req, res) => {
    try {
      const { id, slug_url } = req.query;
  
      if (!id && !slug_url) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either a blog ID or slug URL.',
        });
      }
  
      // Find the blog using `_id` or `slug_url`
      const blogData = await blogModel.findOne({
        $or: [{ _id: id }, { slug_url: slug_url }],
      });
  
      if (!blogData) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found.',
        });
      }
  
      // Update the blog
      const updatedBlog = await blogModel.findOneAndUpdate(
        { _id: blogData._id }, // Use the blog's `_id` for updating
        req.body,
        { new: true } // Return the updated document
      );
  
      return res.status(200).json({
        success: true,
        data: updatedBlog,
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

exports.deleteBlog = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(400).json({
                success: false,
                message: 'Blog ID is required.'
            });
        }

        const blogData = await blogModel.findById(req.query.id);
        if (!blogData) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.'
            });
        }

        const newStatus = blogData.status === 'active' ? 'inactive' : 'active';

        const updatedBlog = await blogModel.findByIdAndUpdate(
            req.query.id,
            { status: newStatus },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: `Blog status changed to ${newStatus}.`,
            data: updatedBlog
        });
    } catch (error) {
        console.error('Error changing blog status:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: error.message
        });
    }
};

const User = require('../models/UserModel');
const Admin = require("../models/AdminModel");
const path = require("path");
const blogModel = require('../models/BlogModel');

const createSlug = (value = '') => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const normalizeBlogFields = (body = {}) => {
  const slug_url = createSlug(body.slug_url || body.blog_title);
  return {
    ...body,
    slug_url,
    canonical_url: body.canonical_url?.trim() || slug_url,
    blog_image_alt: body.blog_image_alt?.trim() || body.blog_title?.trim() || '',
    meta_title: body.meta_title?.trim() || body.blog_title?.trim() || '',
    status: body.status === 'inactive' ? 'inactive' : 'active',
  };
};

exports.createBlog = async (req, res) => {
    const {
        blog_title,
        slug_url,
        blog_description,
        blog_image,
        meta_keywords,
        meta_title,
        meta_description,
        canonical_url,
        blog_image_alt,
        status
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
        const normalizedData = normalizeBlogFields({
            blog_title, slug_url, blog_description, blog_image, meta_keywords,
            meta_title, meta_description, canonical_url, blog_image_alt, status
        });
        const blogData = await blogModel.findOne({
            $or: [{ blog_title: blog_title }, { slug_url: normalizedData.slug_url }]
        });
        if (blogData) {
            return res.status(400).json({
                success: false,
                message: 'Blog title already exists.'
            });
        }

        const newData = new blogModel(normalizedData);

        const savedData = await newData.save();
        return res.status(200).json({
            success: true,
            message: 'Blog added successfully',
            data: savedData
        });
    } catch (error) {
        
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
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

exports.getBlogById = async (req, res) => {
    try {
      const { id, slug_url, public: isPublic } = req.query; // Fetch `id` or `slug_url` from the query
  
      if (!id && !slug_url) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either a blog ID or slug URL.',
        });
      }
  
      // Query the database by `_id` or `slug_url`
      const query = {
        $or: [{ _id: id }, { slug_url: slug_url }],
      };
      if (isPublic === 'true') query.status = 'active';
      const blogData = await blogModel.findOne(query);
  
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
  
      const normalizedData = normalizeBlogFields(req.body);
      if (normalizedData.slug_url !== blogData.slug_url) {
        const existingSlug = await blogModel.findOne({ slug_url: normalizedData.slug_url, _id: { $ne: blogData._id } });
        if (existingSlug) {
          return res.status(400).json({ success: false, message: 'Blog slug already exists.' });
        }
      }

      // Update the blog
      const updatedBlog = await blogModel.findOneAndUpdate(
        { _id: blogData._id }, // Use the blog's `_id` for updating
        { ...normalizedData, updated_at: new Date() },
        { new: true } // Return the updated document
      );
  
      return res.status(200).json({
        success: true,
        data: updatedBlog,
      });
    } catch (error) {
      
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
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: error.message
        });
    }
};

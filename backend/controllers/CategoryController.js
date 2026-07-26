const express = require("express");
const Category = require("../models/CategoryModel");

exports.AddCategory = async (req, res) => {
  try {
    const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    if(!req.body)return res.status(400).json({
      
    })
    let category = req.body;
    const newCategory = new Category(category);
    await newCategory.save();

    res
      .status(200)
      .json({ msg: "Category successfully saved", category: newCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.FetchCategory = async (req, res) => {
  try {
  //   const user = req.user.userID
  //   if(!user){
  // return res.json({
  // status:500,
  // success:false,
  //  message: "User Id not found" })
  //   }
    const { search } = req.query;
    let queryConditions = {};

    // Add column-specific search conditions dynamically
    const searchFields = ["category_name", "parent_category_name", "status"];
    searchFields.forEach((field) => {
      if (req.query[field]) {
        if (field === "status") {
          queryConditions[field] = req.query[field] === "true";
        } else {
          queryConditions[field] = new RegExp(req.query[field], "i");
        }
      }
    });

    // Add global search condition
    if (search) {
      const searchRegex = new RegExp(search, "i");
      queryConditions["$or"] = [
        { category_name: searchRegex },
        { parent_category_name: searchRegex },
        { status: search === "true" },
      ];
    }

    const categories = await Category.find(queryConditions).sort({
      createdAt: -1,
    });
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to find categories" });
  }
};

exports.getSingleCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({ msg: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to find the category" });
  }
};

exports.UpdateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let category = req.body;

    // let filenames = [];
    // if(req.files){
    // req.files.forEach((file) => {
    //   filenames.push(file.filename);
    // });}

    // if (filenames.length > 0) category.images = filenames;

    const updateCategory = await Category.findByIdAndUpdate(
      id,
      {
        category_name: category.category_name,
        status: category.status,
        images: category.images,
        // images: category.images,
      },
      { new: true }
    );

     return res.status(200)
      .json({ msg: "Category successfully Updated", data: updateCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to update the category" });
  }
};

exports.DeleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndUpdate(
      id,
      {
        status: false,
      },
      { new: true }
    );
    if (!deletedCategory) {
      return res.status(400).json({ msg: "Category not found" });
    }
    res.status(200).json({
      msg: "Category successfully Deactivated",
      category: deletedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to deactivate the category" });
  }
};

exports.FetchCategoryByParentCategory = async(req,res)=>{
  try{
    const id = req.params.id;
    const category = await Category.find({parent_category:id,status:true});
    if(!category){
      return res.status(400).json({
        success:false,
        message:"Category not found"
      })
    }
    return res.status(200).json({
      success: true,
      data: category,
    });
  }catch(err){
    res.status(500).json({ success:false,
    message:err.message});
  }
}
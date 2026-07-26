const ParentCategory = require('../models/ParentCategoryModel');

exports.CreateParentCategory = async (req,res)=>{
    try{
        const {name,status} = req.body;
        if(!name){
            return res.status(400).json({
              success: false,
              message: "Parent Category Created Successfully",
            });
        }
        const parentCategory = await ParentCategory.create({
            name,
            status
        });
        if (!parentCategory){
            return res.status(400).json({

            })
        }
          return res.status(200).json({
            success: true,
            message: "Parent Category Created Successfully",
          });

    }catch(err){
   return res.status(500).json({
     success: false,
     message: err.message
   });
    }
}

exports.FetchParentCategory = async(req,res)=>{
    try{
        const parentCategory = await ParentCategory.find();
        return res.status(200).json({
            success:true,
            data:parentCategory

        })
    }catch(err){
 return res.status(500).json({
   success: false,
   message: err.message,
 });
    }
}
exports.UpdateParentCategory = async(req,res)=>{
    try{
        const {name,status} = req.body;
        const id = req.params.id;
          if (!name) {
            return res.status(400).json({
              success: false,
              message: "Parent Category Created Successfully",
            });
          }
          const parentCategory = await ParentCategory.findByIdAndUpdate(id,{
            name,
            status
          },{new:true});
           return res.status(200).json({
             success: true,
             message: "Parent Category Updated Successfully",
             data: parentCategory
           });
    }catch(err){
         return res.status(500).json({
           success: false,
           message: err.message,
         });
    }
}
exports.DeactiveParentCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const parentCategory = await ParentCategory.findByIdAndUpdate(
      id,
      {
        status:false,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Parent Category Deactivated Successfully",
      data: parentCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
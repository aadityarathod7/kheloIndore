const SuperAdmin = require('../models/SuperAdminModel');
const Venue = require('../models/VenueModel');

exports.activeVenue = async (req,res)=>{
    try{
        const venueID = req.params.id;
        if(!venueID){
            return res.status(400).json({
                success:false,
                message:"Not data found in parameter. "
            })
        }
        const check = await Venue.findById(venueID);

        if(!check){
            return res.status(400).json({
              success: false,
              message: "No record Found with this id. ",
            });
        }
        const name = check.name;
        let updateActivation = !check.active;
        const update = await Venue.findByIdAndUpdate(venueID,{
            active:updateActivation
        },{new:true});
        
        return res.status(200).json({
            success:true,
            message:`${name} is Activation ${updateActivation} `
        })
    }catch(err){
        console.log(err.message)
        return res.status(500).json({
          success: false,
          error:err.message
        });
    }
}
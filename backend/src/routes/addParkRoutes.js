import {Router} from "express";
import ParkingSlot from "../models/Parkingslot.js";
import {requireAuth} from "../middleware/requireAuth.js";

const router = Router();

router.post("/", requireAuth, async (req,res) => {
    try {
        const {name,address, city} = req.body;
        const newParking = new ParkingSlot({name,address,city,owner: req.user._id});
        const newSpot = await newParking.save();
        res.status(200).json({sucess:true,data:newSpot});
    }
    catch (error){
        res.status(200).json({sucess:false,message:"server error"});
        console.error("Error in create parking",error.message);
    }

})

router.put("/:id", requireAuth, async (req,res) => {
    const { id } = req.params;
    try{
        const updated = await ParkingSlot.findOneAndUpdate({_id: id, owner: req.user._id}, req.body, {new: true, runValidators: true});
        if(!updated){
            return res.status(404).json({success: false, message: "parking spot not found or already deleted"});
        }
        else{
            res.status(200).json({success: true, message: "updated successfully"});
        }
    }
    catch(error){
        console.log("error in update",error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
})

router.delete("/:id", async (req,res) => {
    const { id } = req.params;
    try{
        const deleteed = await ParkingSlot.findByIdAndDelete(id);
        if(!deleteed){
            return res.status(404).json({success: false, message: "parking spot not found or already deleted"});
        }
        else{
            res.status(200).json({success: true, message: "deleted sucessfully"});
        }
    }
    catch(error){
        return res.status(500).json({success: false, message: "Server error"});
    }
})

export default router;
import {Router} from "express";

import ParkingSlot from "../models/Parkingslot.js";

const router = Router();

router.get('/',async (req,res) => {
    try {
        const  availableParkings = await ParkingSlot.find();
        res.json({"data":availableParkings});
    }
    catch (error){
        console.error("Error in getting all spot", error.message);
    }
})

export default router;
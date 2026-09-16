import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    }
},
    {timestamps:true}
);

const ParkingSlot = mongoose.model("ParkingSlot",parkingSlotSchema);
export default ParkingSlot;


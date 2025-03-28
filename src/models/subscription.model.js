import mongoose ,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }, 
    channel : {
        typeof : Schema.Types.ObjectId,
        ref : "User"
    }
} , { timestamps : true})

export const Subscription = new mongoose.model("Subscription" , subscriptionSchema)
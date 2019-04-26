import mongoose, {Model, Schema} from "mongoose";

const ChatSchema = new Schema({
  message: { type: String, default: "", trim: true, maxlength: 200 },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

type schemaOptions = {
  criteria: Object,
  perPage: bigint,
  page: bigint,
  select: string,
}

ChatSchema.statics = {
  load: function(options: schemaOptions, cb: Function) {
    options.select = options.select || "message sender receiver createdAt";
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function(options: schemaOptions) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("sender", "name username github")
      .populate("receiver", "name username github")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model("Chat", ChatSchema);

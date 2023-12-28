const mongoose = require("mongoose");

const ad = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    //for car
    price: { type: Number },
    brand: { type: String },
    model: { type: String },
    fuel: {
      type: String,
      enum: ["diesel", "petrol", "cng", "hybrid", "electric"],
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
    },
    variant: { type: String },
    manufacturingYear: { type: Number },
    ownership: { type: Number },
    totalDriven: { type: Number },
    isVerfied: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    photos: [{ type: String }],
    //for property rent and sale both
    type: { type: String },
    furnishing: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number },
    occupancy: {
      type: String,
      enum: ["sharing", "non-sharing"],
    },
    bachelorAllowed: {
      type: Boolean,
    },
    totalFloor: {
      type: Number,
    },
    carParking: { type: Boolean },
    facing: { type: String },
    construnction: {
      type: String,
      enum: ["newLaunch", "readyToMove", "underConstruction"],
    },
    city: { type: String },
    state: { type: String },
    locality: { type: String },
    listedBy: { type: String, enum: ["dealer", "owner", "builder"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "complete", "cancelled"],
      default: "pending",
    },
    isVerifiedByUser: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ad.index([{ title: 1, description: 1, user: 1 }], { unique: true });

const Ad = mongoose.model("Ad", ad);

module.exports = Ad;

// "Select Type > Select Furnishing > Select Bedrooms > Select Bathrooms
// Listed by (Dealer, Owner, Builder)
// Area (sq. ft)
// Occupancy (Sharing, Non sharing) or Bachelors Allowed (yes or no)
// Maintenance (Monthly)
// Total floor or Floor no.
// Car Parking
// Facing
// Construction Status (New Launch, Ready to Move, Under Construction)"

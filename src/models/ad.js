const mongoose = require("mongoose");
const { Status, Fuel, Transmission, Occupancy } = require("../../enums");

const ad = new mongoose.Schema(
  {
    title: { type: String },
    company: { type: String },
    description: { type: String },
    //for car
    price: { type: Number },
    brand: { type: String },
    model: { type: String },
    rtoCity: { type: String },
    fuel: {
      type: String,
      enum: Object.values(Fuel),
    },
    transmission: {
      type: String,
      enum: Object.values(Transmission),
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
      enum: Object.values(Occupancy),
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
    //plot
    length: { type: Number },
    breadth: { type: Number },
    //electronics
    condition: { type: String, enum: ["new", "used", "refurbished"] },
    purchasedYear: { type: Number },
    //furniture
    sitting: { type: Number },
    city: { type: String },
    state: { type: String },
    locality: { type: String },
    listedBy: { type: String, enum: ["dealer", "owner", "builder"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(Status),
      default: "pending",
    },
    isVerifiedByUser: { type: Boolean, default: false },
    enquiryCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

ad.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 600,
    partialFilterExpression: { isVerifiedByUser: false },
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

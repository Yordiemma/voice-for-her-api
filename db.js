const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};

const reportSchema = new mongoose.Schema({
  abuseType: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  contactInfo: String,
  contactRemovalToken: String,
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = { connectDB, Report };

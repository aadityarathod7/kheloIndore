const Review = require("../models/ReviewModel");

const attachRatings = async (records, targetType) => {
  const list = records.map((record) => (record.toObject ? record.toObject() : record));
  const ids = list.map((record) => record._id);
  if (!ids.length) return list;
  const aggregates = await Review.aggregate([
    { $match: { target_type: targetType, target_id: { $in: ids } } },
    { $group: { _id: "$target_id", rating: { $avg: "$rating" }, reviews_count: { $sum: 1 } } },
  ]);
  const byId = new Map(aggregates.map((item) => [String(item._id), item]));
  return list.map((record) => {
    const aggregate = byId.get(String(record._id));
    return { ...record, rating: aggregate ? Number(aggregate.rating.toFixed(1)) : 0, reviews_count: aggregate?.reviews_count || 0 };
  });
};

module.exports = { attachRatings };

const WalletTransaction = require("../models/WalletTransactionModel");

exports.getMyWallet = async (req, res) => {
  try {
    const userId = req.user?.userID;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const transactions = await WalletTransaction.find({ user_id: userId }).sort({ createdAt: -1 }).limit(100).lean();
    const totals = transactions.reduce((result, transaction) => {
      const amount = Number(transaction.amount) || 0;
      if (transaction.type === "debit") result.debit += amount;
      else result.credit += amount;
      return result;
    }, { credit: 0, debit: 0 });
    return res.json({ success: true, wallet: { balance: totals.credit - totals.debit, ...totals, transactionCount: transactions.length }, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load wallet" });
  }
};

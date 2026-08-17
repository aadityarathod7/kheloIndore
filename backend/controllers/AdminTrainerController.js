// backend/controllers/AdminTrainerController.js

const PersonalTrainer = require('../models/PersonalTrainingModel');

/**
 * GET /admin/pending-trainers
 * Returns all trainers/coaches that have submitted for approval (awaiting_approval=true, status=false).
 * Only Super Admin can call this.
 */
exports.getPendingTrainers = async (req, res) => {
  try {
    const pending = await PersonalTrainer.find(
      { awaiting_approval: true, status: false },
      'first_name last_name email mobile trainer_type profile_picture createdAt awaiting_approval status verification_status'
    ).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: pending });
  } catch (error) {
    console.error('Error fetching pending trainers:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /admin/approveTrainer/:id
 * Approve a Personal Trainer profile.
 * Sets status=true, is_admin_access=1, verification_status=1, awaiting_approval=false.
 * Only Super Admin can call this (enforced by requireRole middleware).
 */
exports.approveTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PersonalTrainer.findByIdAndUpdate(
      id,
      {
        status: true,
        is_admin_access: 1,
        verification_status: 1,
        awaiting_approval: false,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    return res.status(200).json({ success: true, message: 'Trainer approved successfully', data: updated });
  } catch (error) {
    console.error('Error approving trainer:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /admin/rejectTrainer/:id
 * Reject a Personal Trainer profile.
 * Sets awaiting_approval=false, status=false so trainer can re-edit and re-submit.
 * Only Super Admin can call this.
 */
exports.rejectTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // optional rejection reason

    const updated = await PersonalTrainer.findByIdAndUpdate(
      id,
      {
        status: false,
        is_admin_access: 0,
        verification_status: 0,
        awaiting_approval: false,
        rejection_reason: reason || '',
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    return res.status(200).json({ success: true, message: 'Trainer profile rejected. Trainer can re-edit and resubmit.', data: updated });
  } catch (error) {
    console.error('Error rejecting trainer:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

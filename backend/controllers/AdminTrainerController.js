// backend/controllers/AdminTrainerController.js
const PersonalTrainer = require('../models/PersonalTrainingModel');
const Coach = require('../models/CoachModel');
const User = require('../models/UserModel');

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

/**
 * GET /admin/pending-coaches
 * Returns all coaches that have submitted for approval (awaiting_approval=true, status=false).
 * Only Super Admin can call this.
 */
exports.getPendingCoaches = async (req, res) => {
  try {
    const pending = await Coach.find(
      { awaiting_approval: true, status: false },
      'first_name last_name email mobile coaching_levels profile_picture createdAt awaiting_approval status verification_status'
    ).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: pending });
  } catch (error) {
    console.error('Error fetching pending coaches:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /admin/approveCoach/:id
 * Approve a Coach profile.
 * Sets status=true, is_admin_access=1, verification_status=1, awaiting_approval=false.
 * Only Super Admin can call this.
 */
exports.approveCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Coach.findByIdAndUpdate(
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
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    // Sync is_admin_access with the User record
    await User.findOneAndUpdate(
      { mobile: updated.mobile },
      { is_admin_access: 1, status: true }
    );

    return res.status(200).json({ success: true, message: 'Coach approved successfully', data: updated });
  } catch (error) {
    console.error('Error approving coach:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /admin/rejectCoach/:id
 * Reject a Coach profile.
 * Sets awaiting_approval=false, status=false so coach can re-edit and re-submit.
 * Only Super Admin can call this.
 */
exports.rejectCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updated = await Coach.findByIdAndUpdate(
      id,
      {
        status: false,
        is_admin_access: 2,
        verification_status: 2,
        awaiting_approval: false,
        rejection_reason: reason || '',
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    // Sync is_admin_access with the User record
    await User.findOneAndUpdate(
      { mobile: updated.mobile },
      { is_admin_access: 2, status: false }
    );

    return res.status(200).json({ success: true, message: 'Coach profile rejected. Coach can re-edit and resubmit.', data: updated });
  } catch (error) {
    console.error('Error rejecting coach:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


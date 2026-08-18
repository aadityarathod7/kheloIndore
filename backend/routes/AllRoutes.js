const express = require("express");
const route = express.Router();
const { getMyWallet } = require("../controllers/WalletController");
const { getReviews, createReview } = require("../controllers/ReviewController");
const { myNotifications, markNotificationsRead } = require("../controllers/NotificationController");
const mail = require('../controllers/NodeMailerController')

const imageUpload= require('../middlewares/multer')
const { rateLimit } = require('../middlewares/security')

// Tight limits for authentication endpoints (brute-force / OTP abuse protection)
// Generous enough not to false-positive on shared office/college NAT IPs
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
const otpLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
const {
  createActivity,
  fetchActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/ActivityController");


//CATEGORY
const {
  AddCategory,
  FetchCategory,
  getSingleCategory,
  UpdateCategory,
  DeleteCategory,
  FetchCategoryByParentCategory,
} = require("../controllers/CategoryController");

//BLOG
const {
  createBlog,
  getBlogById,
  getAllBlog,
  getAllActiveBlog, 
  updateBlog,
  deleteBlog,
} = require("../controllers/BlogController");

//VENUE
const {
  createVenue,
  createVenue2,
  fetchVenue,
  SingleVenue,
  getVenueForAdmin,
  updateVenue,
  deleteVenue,
  addVenue,
  getVenue,
  getVenueById,
  getVenuesByVendorType,
  getVenueByAdminId,
  createVendor,
  getVendors,
  getVenueNew,
  getVenueRoleList,
  venueVerifyBySuperAdmin,
  toggleVenueStatus,
} = require("../controllers/VenueController");

const {
  isUser,
  auth,
  isVenueAdmin,
  updateAuth,
  isAuthenticated,
  requireRole,
} = require("../middlewares/middleware");

//USER
const {
  getUserById,
  deleteUser,
  signup,
  loginWithPassword,
  loginUserWithMobile,
  loginCheckOTP,
  getAllUsers,
  createAdmin,
  getAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  signupVerifyOTP,
  signupBySuperAdmin,
  UpdateUser,
  dashboardCount,
  getUsersCountPerMonth,
  uploadFile,
  searchUsers, 
  codeAndCocktailsEmail,
  updateProfileSettting,
  updateAdminStatus,
  venueAdminlist,
  userlist,
  fetchAllUsers,
  resetPassword,
  verifyOtp,
  forgotPassword, 
} = require("../controllers/AdminController");

const { activeVenue } = require("../controllers/SuperAdminController");

//COACH
const {
  // createCoach,getCoaches
  createCoach,
  deleteCoach,
  updateCoach,
  fetchAllCoaches,
  fetchCoachById,
  updateCoachSuperAdmin,
  fetchAllCoachesNew,
  coachVerifyBySuperAdmin,
  updatecoach,
  fetchPublicCoach,
  generateCoachShareLink,
  fetchSharedCoach,
  completeCoachProfile,
  sendOnboardingProfileLink,
  submitCoachForApproval,
} = require("../controllers/CoachController");
//PERSONAL TRAINING
const {
  fetchAllPersonalTrainers,
  createPersonalTrainer,
  fetchPersonalTrainerById,
  fetchPersonalTrainerForAdmin,
  updatePersonalTrainer,
  deletePersonalTrainer,
  fetchAllPersonalTrainersForWeb,
  updatePersonalTrainers,
  fetchPublicTrainer,
  generateTrainerShareLink,
  fetchSharedTrainer,
  completeTrainerProfile,
  sendTrainerOnboardingProfileLink,
  submitTrainerForApproval,
} = require("../controllers/PersonalTrainingController");

// Admin Trainer/Coach Approval
const {
  getPendingTrainers,
  approveTrainer,
  rejectTrainer,
  getPendingCoaches,
  approveCoach,
  rejectCoach,
} = require("../controllers/AdminTrainerController");

//CONTACT US
const {
  createContactUs,
  fetchContactUs,
} = require("../controllers/ContactUsController");

// for user
route.post("/user/signup", authLimiter, signup, mail.mail);
route.post("/user/forgot-password", otpLimiter, forgotPassword);
route.post("/user/verfy-otp", otpLimiter, verifyOtp);
route.post("/user/reset-password", otpLimiter, resetPassword);


route.post("/admin/signup", auth, requireRole("Super Admin"), signup);

// Super Admin
route.post("/super-admin/add-user", auth, signupBySuperAdmin);
route.get("/dashboard/count",auth, dashboardCount);
route.get("/users-count-per-month", getUsersCountPerMonth);
route.put("/super-admin/update-user/:id", auth, requireRole("Super Admin"), UpdateUser);
route.put("/super-admin/update-admin-status", auth, requireRole("Super Admin"), updateAdminStatus);
route.get("/super-admin/user-list", auth, requireRole("Super Admin"), userlist)
route.get("/super-admin/venuadmin-list", auth, requireRole("Super Admin"), venueAdminlist)
route.get("/super-admin/all-list", auth, requireRole("Super Admin"), fetchAllUsers)
// Swap
route.post("/codeAndCocktailsEmail", codeAndCocktailsEmail);

//Users
route.post("/user/registration/otp", otpLimiter, signupVerifyOTP, mail.mail);
route.post("/user/login", authLimiter, loginWithPassword);
route.post("/user/login/mobile", otpLimiter, loginUserWithMobile);
route.post("/user/login/mobile/otp", otpLimiter, loginCheckOTP);
route.get("/user/getallUser", auth, requireRole("Super Admin"), getAllUsers);
route.delete("/user/delete/:id", auth, requireRole("Super Admin"), deleteUser);
route.put("/user/updateUser", auth, requireRole("Super Admin"), UpdateUser);
route.get("/user/fetch-user-by-id/:id", auth, getUserById);
route.put("/user/profile-setting/:id", auth, updateProfileSettting)  //shubham
// adminpanel
route.post("/admin/create", auth, requireRole("Super Admin"), createAdmin);
route.get("/admin/fetch", auth, requireRole("Super Admin"), getAdmin);
route.get("/admin/fetch-ind/:id", auth, requireRole("Super Admin"), getAdminById);
route.put("/admin/update/:id", auth, requireRole("Super Admin"), updateAdmin);
route.delete("/admin/delete/:id", auth, requireRole("Super Admin"), deleteAdmin);

//venue not working
route.post("/venue/add", auth, isVenueAdmin, createVenue); //with JWT auth
// route.get("/venue/getVenue", getVenue); old
route.get("/venue/getVenue",auth, getVenueNew); // new by sunil
route.get("/venue/getVenueById/:id", getVenueById);
// route.get("/get/venue/role/list",auth,getVenueRoleList)
route.get("/get/venue/role/list",getVenueRoleList)

//Venue Working
route.post("/venue/addVenue",auth, addVenue);
route.get("/venue/fetch", fetchVenue);
route.get("/venue/individual/:id", SingleVenue);
route.get("/venue/admin/individual/:id", auth, getVenueForAdmin);
route.put("/venue/edit/:id", auth, updateVenue);
route.delete("/venue/delete/:id", auth, deleteVenue);
route.get("/venue/fetch/vendor-type", getVenuesByVendorType);
route.post("/vendor/create", auth, requireRole("Super Admin"), createVendor);
route.get("/vendor/get", getVendors);
route.get("/venue/get/admin-id/:id", getVenueByAdminId);
route.patch("/venues/:id", auth, requireRole("Super Admin"), toggleVenueStatus);
//super admin
route.post("/venue/active/:id", auth, requireRole("Super Admin"), activeVenue);

//Blogs
route.post("/blog/create", auth, requireRole("Super Admin"), createBlog);  //shubham
route.get("/blog/getBlogById", getBlogById); //shubham
route.get("/blog/getAllBlog", getAllBlog);
route.get("/blog/getAllActiveBlog",getAllActiveBlog);
route.put("/blog/updateBlog", auth, requireRole("Super Admin"), updateBlog); //shubham
route.put("/blog/deleteBlog", auth, requireRole("Super Admin"), deleteBlog); //shubham

//Coaches
route.post("/create-coach",auth, createCoach);
route.delete("/delete-coach/:id", auth, deleteCoach);
route.put("/update-coach-super-admin/:id", auth, updateCoachSuperAdmin);
// route.get('/fetch-all-coaches', fetchAllCoaches); // old 
route.get('/fetch-all-coaches',auth,fetchAllCoachesNew); // new by sunil
route.get('/fetch-coach/:id', auth, fetchCoachById);
route.put("/update/coach/:coachId", auth, updatecoach)
// Public coach endpoints (website)
route.get("/web/fetch-coach/:id", fetchPublicCoach);
route.post("/web/coach/share/:id", auth, generateCoachShareLink);
route.get("/web/coach/shared/:token", fetchSharedCoach);
route.put("/web/coach/complete-profile/:id", completeCoachProfile);
route.post("/web/coach/onboarding/:id", sendOnboardingProfileLink);

//category
route.post("/category/create", auth, requireRole("Super Admin"), AddCategory);

route.get("/category/fetch", FetchCategory);
route.get("/category/fetch-ind/:id",auth, getSingleCategory);
route.put("/category/update/:id", auth, requireRole("Super Admin"), UpdateCategory);
route.delete("/category/delete/:id", auth, requireRole("Super Admin"), DeleteCategory);
route.get("/category/fetch/parent-id/:id",auth, FetchCategoryByParentCategory);

const {
  CreateParentCategory,
  FetchParentCategory,
  UpdateParentCategory,
  DeactiveParentCategory,
} = require("../controllers/ParentCategoryController");
//parent category
route.post("/parent-category/add", auth, requireRole("Super Admin"), CreateParentCategory);
route.get("/parent-category/fetch", FetchParentCategory);
route.put("/parent-category/update/:id", auth, requireRole("Super Admin"), UpdateParentCategory);
route.delete("/parent-category/delete/:id", auth, requireRole("Super Admin"), DeactiveParentCategory);


// Activities Router
route.post("/activity/create", auth, requireRole("Super Admin"), createActivity);
route.get("/activity/fetch", fetchActivity);
route.put("/activity/update/:id", auth, requireRole("Super Admin"), updateActivity);
route.delete("/activity/delete/:id", auth, requireRole("Super Admin"), deleteActivity);

// Personal Training
route.post("/PersonalTraining/create",auth, createPersonalTrainer);
route.delete("/PersonalTraining/deactive/:id",auth, deletePersonalTrainer);
route.put("/PersonalTraining/update/:id",auth, updatePersonalTrainer);
route.get("/admin/PersonalTraining/fetch/:id",auth, fetchPersonalTrainerForAdmin);
route.get("/PersonalTraining/fetch/:id", fetchPersonalTrainerById);
route.get("/PersonalTraining/fetchAll",auth, fetchAllPersonalTrainers);
route.put("/updatePersonalTrainer/:trainerId",auth,updatePersonalTrainers)
const {
  createEvent,
  getEvent,
  updateEvent,
  deactivateEvent,
  getAllEvents,
} = require("../controllers/EventController");
//Events
route.post("/event/create", auth, requireRole("Super Admin"), createEvent);
route.get("/event/get/:id", getEvent);
route.put("/event/update/:id", auth, requireRole("Super Admin"), updateEvent);
route.delete("/event/delete/:id", auth, requireRole("Super Admin"), deactivateEvent);
route.get("/event/fetchAll", getAllEvents);
// route.get("/event/fetchAll",auth, getAllEvents);

const {
  createEnquiry,
  fetchEnquiries,
} = require("../controllers/EnquiryController");

//Enquiry
route.post("/enquiry/create", createContactUs);
route.get("/enquiry/fetchAll", fetchContactUs);

//Contact US
route.post("/contactUs/create", createContactUs);
route.get("/contactUs/fetchAll", fetchContactUs);

//Dashboard
const {
  DateFilter,
  fetchVisitors,
  bookingRevenueAnalytics,
  downloadAnalyticsReport,
} = require("../controllers/DashboardController");

route.get("/dashboard/datefilter",auth, DateFilter);
route.get("/dashboard/fetch-visitors",auth, fetchVisitors);
route.get("/dashboard/analytics",auth, bookingRevenueAnalytics);
route.get("/dashboard/analytics/download",auth, downloadAnalyticsReport);
route.get("/wallet/me", auth, getMyWallet);
route.get("/reviews/:type/:id", getReviews);
route.put("/reviews/:type/:id", auth, createReview);
route.get("/notifications/me", auth, myNotifications);
route.put("/notifications/read", auth, markNotificationsRead);

//Images
route.post(
  "/upload-file",
  auth,
  imageUpload.fields([ 
    {
      name: "uploadFile", 
      maxCount: 10,
    },
  ]),
  uploadFile
);
// for venue slot
const {createSlots,fetchSlots, getAllSlotsByVenueId, getSlotsBySlotID,updateSlotBySlotID,getSlotById,deleteSlotBySlotID,carryForwardSlots}= require("../controllers/SlotController");
route.post("/slot/add/:id", auth, createSlots);
route.post("/slot/carry-forward/:id", auth, carryForwardSlots);
route.get("/slot/get/:slot_id",auth,getSlotById)
route.put("/slot/update-add/:id", auth, updateSlotBySlotID);
route.put("/slot/delete-by-slotid/:id",auth,deleteSlotBySlotID);
route.get("/venue/fetch-slot/:id", fetchSlots);
route.get("/venue/fetch-all-slot/:venueId", getAllSlotsByVenueId);
route.get("/get/venue/fetch-slot/:id", getSlotsBySlotID);

const {
  addBooking,
  addManualBooking,
  getBookings,
  getBookingByVendorId,
  bookingVerifyStatusById,
  getBookingsNotification,
  cancelBookingForVenue,
  cancelBookingForPersonalTrainer,
  cancelBookingForCoach,
  requestCancellationOtp,
} = require('../controllers/BookingController');
// for venue
route.post("/booking/add", auth, addBooking);
route.post("/booking/manual/add", auth, addManualBooking);
route.get("/booking/get",auth, getBookings); // for admin 
route.get("/get/booking/:vendor_id",auth, getBookingByVendorId); // for admin 
route.get("/booking/notification",auth, getBookingsNotification ); 
route.post("/booking/cancellation/venue",auth,cancelBookingForVenue)
route.post("/booking/cancellation/pt",auth,cancelBookingForPersonalTrainer)
route.post("/booking/cancellation/coach",auth,cancelBookingForCoach)
route.post("/booking/cancellation/request-otp",auth,requestCancellationOtp)
//dashboard
const{bookingDetailCount,userGrowthGraph,totalrevenue,getMoneyReviews} =require('../controllers/DashboardController')
route.get("/dashboard/booking",auth, bookingDetailCount);
route.get("/dashboard/revenue",auth, totalrevenue);
route.get("/dashboard/amountReviews",auth, getMoneyReviews);

route.get("/user-growth-graph",auth,userGrowthGraph);

// Provider Earnings Dashboard APIs
const { getEarningsSummary, getMonthlyEarnings, getRecentBookings, getVendorSettlements, recordVendorPayout } = require("../controllers/EarningsController");
route.get("/earnings/summary", auth, getEarningsSummary);
route.get("/earnings/monthly", auth, getMonthlyEarnings);
route.get("/earnings/recent-bookings", auth, getRecentBookings);
route.get("/earnings/vendor-settlements", auth, getVendorSettlements);
route.post("/earnings/vendor-payouts", auth, recordVendorPayout);
const {
  addLoaction,
  getLoaction,
} = require("../controllers/NearByLocationController");
route.post("/near-by/create", addLoaction);
route.get("/near-by/get", getLoaction);


// for Coach Slot
const {
  createCoachSlot,
  getCoachBatchSlots,
  fetchAllCoachBatches,
  getAllCoachesSlotsByCoachId,
  updateCoachSlotById,
  updateCoachSlotByIdNew,
  deleteCoachBatch,
  fetchCoachSlotByDateId,
  updateCoachSlotBooking,
  deleteSlotsByDateRangeCoach
} = require("../controllers/CoachSlotController");
route.post("/coach-slot/add/:coachId", auth, createCoachSlot);
route.put("/coach-slot/delete", auth, deleteSlotsByDateRangeCoach);
route.put("/coach-slot/update/:coachId/:slotId/:coachSlotId", auth, updateCoachSlotById);
route.put("/coach-slot/update/:coachSlotId", auth, updateCoachSlotByIdNew);
route.put("/cancel-coach-slot/:id", auth, updateCoachSlotBooking);
route.delete("/coach-slot/delete/:coachSlotId", auth, deleteCoachBatch);
route.get("/get-all-coach-slot/:coachId",auth, getAllCoachesSlotsByCoachId);
route.get("/coach-slot/fetch/:id",auth, getCoachBatchSlots);
route.get("/coach/batches/:id", fetchAllCoachBatches); 
route.get("/get-coach-slot-by-date/:id",fetchCoachSlotByDateId); 
const {
  bookCoach,
  fetchCoachBooking,
} = require("../controllers/CoachBookingController");
route.post("/coach/booking", auth, bookCoach);
route.get("/coach/booking/fetch",auth, fetchCoachBooking);
// for pt slots
const {addSlotPT,getPtBatch,getPtSlots, updatePTSlotById,createPersonalTrainerSlot,getAllPersonalTrainerSlotsByTrainerId,fetchPersonalTrainerSlotByDateId,deleteSlotsByDateRangept} = require('../controllers/PersonalTrainerSlotController');
route.post('/pt/batch/add/:PTId', auth, addSlotPT);
route.put('/pt/slot/delete', auth, deleteSlotsByDateRangept);
route.post('/pt/slots/add/:id', auth, createPersonalTrainerSlot);
route.get('/get-all-pt-slot/:id',getAllPersonalTrainerSlotsByTrainerId);
route.get('/get-pt-slot-by-date/:id',fetchPersonalTrainerSlotByDateId);
route.put('/pt/batch/update/:PTId/:slotId', auth, updatePTSlotById);
route.get("/pt/batch/:id", getPtBatch);
route.get("/pt/batch/slot/:id", getPtSlots);
route.delete("/pt/batch/delete/:PTId", auth, deleteCoachBatch);

const{createPTBooking, getPTBooking,cancelPtSlotBooking} = require('../controllers/PersonalTrainerBookingController');
route.post("/pt/booking", auth, createPTBooking);
route.put("/pt/cancelbooking/:id", auth, cancelPtSlotBooking);
route.get("/pt/booking/get",auth, getPTBooking);
//Phonepe
const { venuePayment, venuePaymentStatus, coachPaymentStatus, coachPayment, personalTrainerPayment, personalTrainerPaymentStatus,getVenueBookingByUserId,getCoachBookingByUserId,getPersonalTrainerBookingByUserId, getVenueCoachPTBookingByUserId,venueRefund,getAllRefunds }  = require("../controllers/paymentController");
route.post('/venue/payment', auth, venuePayment);
route.all('/get/venue/payment/status/:txnId', venuePaymentStatus);
route.get('/get/booking/by/:userId', getVenueBookingByUserId);

route.post('/coach/payment', auth, coachPayment);
route.all('/get/coach/payment/status/:txnId', coachPaymentStatus);
route.get('/get/coachBooking/by/:userId', getCoachBookingByUserId);

route.post('/personalTrainer/payment', auth, personalTrainerPayment);
route.all('/get/personalTrainer/payment/status/:txnId', personalTrainerPaymentStatus);
route.get('/get/personalTrainerBooking/by/:userId', getPersonalTrainerBookingByUserId);

route.post('/refund/:BookingId', auth, venueRefund);
route.get('/getrefund',getAllRefunds);
//  all booing in one API by userID
route.get('/get/venue-coach-pt-booking/:userId',getVenueCoachPTBookingByUserId)
// API for web 
route.get('/web/fetch-all-coaches', fetchAllCoaches);
route.get("/web/venue/getVenue", getVenue)
route.get("/web/PersonalTraining/fetchAll", fetchAllPersonalTrainersForWeb);
// Public trainer endpoints (website)
route.get("/web/PersonalTraining/fetch/:id", fetchPublicTrainer);
route.post("/web/PersonalTraining/share/:id", auth, generateTrainerShareLink);
route.get("/web/PersonalTraining/shared/:token", fetchSharedTrainer);
route.put("/web/PersonalTraining/complete-profile/:id", completeTrainerProfile);
route.post("/web/PersonalTraining/onboarding/:id", sendTrainerOnboardingProfileLink);
//  booking verify by admin and super admin
route.put("/verify/booking/status/:bookingId/:verifyStatus",auth,bookingVerifyStatusById)
// route.put("/verify/booking/status",auth,bookingVerifyStatusById)
//  coach verify by super admin
route.put("/verify/coach/:coachId/:verifyStatus",auth,coachVerifyBySuperAdmin)
route.put("/verify/venue/:venueId/:verifyStatus",auth,venueVerifyBySuperAdmin)

// ── Trainer / Coach Approval Workflow ─────────────────────────────────────
// Trainer submits their finished profile for Super Admin review
route.post("/personal-training/submit-for-approval/:id", auth, submitTrainerForApproval);
// Super Admin: list all pending trainers
route.get("/admin/pending-trainers", auth, requireRole("Super Admin"), getPendingTrainers);
// Super Admin: approve a trainer
route.post("/admin/approveTrainer/:id", auth, requireRole("Super Admin"), approveTrainer);
// Super Admin: reject a trainer
route.post("/admin/rejectTrainer/:id", auth, requireRole("Super Admin"), rejectTrainer);

// Coach submits profile for Super Admin review
route.post("/coach/submit-for-approval/:id", auth, submitCoachForApproval);
// Super Admin: list all pending coaches
route.get("/admin/pending-coaches", auth, requireRole("Super Admin"), getPendingCoaches);
// Super Admin: approve a coach
route.post("/admin/approveCoach/:id", auth, requireRole("Super Admin"), approveCoach);
// Super Admin: reject a coach
route.post("/admin/rejectCoach/:id", auth, requireRole("Super Admin"), rejectCoach);

module.exports = route;

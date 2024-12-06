import express from "express";
import AuthMiddleware, { roleAuthorization } from "../app/middlewares/AuthMiddleware.js";
import { uploadSingleImage } from "../app/utility/fileUpload.js";
import * as UsersController from "../app/controllers/UsersController.js";
import * as BlogController from "../app/controllers/BlogController.js";
import * as TeamController from "../app/controllers/TeamController.js";
import * as ServiceController from "../app/controllers/ServiceController.js";
import * as SliderController from "../app/controllers/SliderController.js";
import * as AboutController from "../app/controllers/AboutController.js";
import * as ContactController from "../app/controllers/ContactController.js";

const router = express.Router()

//auth routes
router.post("/registration", UsersController.Registration)
router.post("/login", UsersController.Login)
router.get("/admin/profile", AuthMiddleware, roleAuthorization(['admin']), UsersController.ProfileRead);
router.post("/admin/profile-update", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "profiles"), UsersController.ProfileUpdate);
router.get("/logout", AuthMiddleware, UsersController.Logout);

//-----------back-end routes start------------------//

//blog routes
router.post("/admin/blog/create", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "blogs"), BlogController.CreateBlog);
router.get("/admin/blog/:id", AuthMiddleware, roleAuthorization(['admin']), BlogController.GetBlogById);
router.get("/admin/blogs", AuthMiddleware, roleAuthorization(['admin']), BlogController.GetAllBlogs);
router.post("/admin/blog/update/:id", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "blogs"), BlogController.UpdateBlog);
router.get("/admin/blog/delete/:id", AuthMiddleware, roleAuthorization(['admin']), BlogController.DeleteBlog);

//team member routes
router.post("/admin/team-member/create", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "team-members"), TeamController.CreateTeamMember);
router.get("/admin/team-member/:id", AuthMiddleware, roleAuthorization(['admin']), TeamController.GetTeamMemberById);
router.get("/admin/team-members", AuthMiddleware, roleAuthorization(['admin']), TeamController.GetAllTeamMembers);
router.post("/admin/team-member/update/:id", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "team-members"), TeamController.UpdateTeamMember);
router.get("/admin/team-member/delete/:id", AuthMiddleware, roleAuthorization(['admin']), TeamController.DeleteTeamMember);

//service routes
router.post("/admin/service/create", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "services"), ServiceController.CreateService);
router.get("/admin/service/:id", AuthMiddleware, roleAuthorization(['admin']), ServiceController.GetServiceById);
router.get("/admin/services", AuthMiddleware, roleAuthorization(['admin']), ServiceController.GetAllServices);
router.post("/admin/service/update/:id", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "services"), ServiceController.UpdateService);
router.get("/admin/service/delete/:id", AuthMiddleware, roleAuthorization(['admin']), ServiceController.DeleteService);

//slider routes
router.post("/admin/slider/create", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "sliders"), SliderController.CreateSlider);
router.get("/admin/slider/:id", AuthMiddleware, roleAuthorization(['admin']), SliderController.GetSliderById);
router.get("/admin/sliders", AuthMiddleware, roleAuthorization(['admin']), SliderController.GetAllSliders);
router.post("/admin/slider/update/:id", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "sliders"), SliderController.UpdateSlider);
router.get("/admin/slider/delete/:id", AuthMiddleware, roleAuthorization(['admin']), SliderController.DeleteSlider);

//about routes
router.post("/admin/about/create", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "about"), AboutController.CreateAbout);
router.get("/admin/about/:id", AuthMiddleware, roleAuthorization(['admin']), AboutController.GetAboutById);
router.get("/admin/about", AuthMiddleware, roleAuthorization(['admin']), AboutController.GetAllAbout);
router.post("/admin/about/update/:id", AuthMiddleware, roleAuthorization(['admin']), uploadSingleImage("./storage/images", "about"), AboutController.UpdateAbout);
router.get("/admin/about/delete/:id", AuthMiddleware, roleAuthorization(['admin']), AboutController.DeleteAbout);

//-----------back-end routes end------------------//

//-----------front-end routes start------------------//

//slider routes
router.get("/sliders", SliderController.GetLatestSliders);

//about routes
router.get("/about", AboutController.GetLatestAbout);

//blog routes
router.get("/latest-blogs", BlogController.GetLatestBlogs);
router.get("/blogs", BlogController.GetAllBlogs);
router.get("/blog-details/:id", BlogController.GetBlogById);

//team member routes
router.get("/team-members", TeamController.GetLatestTeamMembers);

//service routes
router.get("/latest-services", ServiceController.GetLatestServices);
router.get("/services", ServiceController.GetAllServices);

//contact mail routes
router.post("/contact-mail", ContactController.ContactMailSend);

//-----------front-end routes end------------------//

export default router;
// import { ObjectId } from "mongodb";
// import { extractObjectId } from "../../utils/extractObjectId";

// const express = require("express");
// import AuthService from "../../services/user.services/auth.service";

// const router = express.Router();

// // Route to fetch profiles with matching technologies
// router.get("/search", async (req: any, res: any) => {
//   const requestedTechnologies = req.query.technologies.split(",");
//   const minExperience = req.query.minExperience;
//   const maxExperience = req.query.maxExperience;

//   const userId = new ObjectId(extractObjectId(req.user?._id));

//   try {
//     const profiles = await service.get({
//       technology: { $in: requestedTechnologies },
//       experience: { $gte: minExperience, $lte: maxExperience },
//       id: { $nin: [userId] }, // Exclude the specified user ID
//     });
//     res.json(profiles);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;

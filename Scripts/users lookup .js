db.getCollection("user-group-details").aggregate(
     [
         { $match : { userId : new ObjectId("637753258b7231ad519c961f") }},
         {
          $lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "group"
          }
         } ,
//          {   $unwind:"$userGroupDetails" },  
//          
//           {
//          $lookup: {
//            from: "groups",
//            localField: "userGroupDetails.groupId",
//            foreignField: "_id",
//            as: "group"
//          }
//         } ,
//           {   $unwind:"$group" },  
          
//        {$wind :"$group}
])

         
       



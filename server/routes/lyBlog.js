const multer = require("multer");
const Author = require("../models/author");
const BlogLy = require("../models/blogLy");
const Category = require("../models/category");
const https = require("https");
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");

const { createClient } = require("@supabase/supabase-js");
const app = express();
const supabaseUrl = "https://ykmowljgyvzwdcmkmffi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbW93bGpneXZ6d2RjbWttZmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE5NTE5NDUsImV4cCI6MjAyNzUyNzk0NX0.NuOkvx9d5ToQMccyx9dal2RCAMpAAsbjPnlpI-aK0l8";
const supabase = createClient(supabaseUrl, supabaseKey);

const fs = require("fs");
const router = require("express").Router();
const addBlog = require("../controllers/addBlog");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dlaahua4u",
  api_key: "189524512316711",
  api_secret: "XtS8YfVdcvtTOkpPn4dRIYzuOLU",
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   // params: {
//   //   folder: "Blog_Ly",
//   //   // format: async (req, file) => "png",
//   //   // Extract file extension
//   //   // const fileExt = path.extname(file.originalname).toLowerCase();

//   //   // Check if the file extension is one of the allowed formats
//   //   //   const allowedFormats = [
//   //   //     ".jpg",
//   //   //     ".jpeg",
//   //   //     ".png",
//   //   //     ".webp",
//   //   //     ".xlsx",
//   //   //     ".docx",
//   //   //     ".md",
//   //   //     ".pdf",
//   //   //   ];
//   //   //   if (allowedFormats.includes(fileExt)) {
//   //   //     // return fileExt.substring(1); // Remove the leading dot from the extension
//   //   //   } else {
//   //   //     throw new Error("Invalid file format");
//   //   //   }
//   //   // },
//   //   // public_id: (req, file) => {
//   //   //   const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");

//   //   //   // Append timestamp and original file extension
//   //   //   return (
//   //   //     fileNameWithoutExt + "-" + Date.now() + path.extname(file.originalname)
//   //   //   );
//   // },
//   // folder: "Blog_Ly", // Optional folder for the uploaded files
//   // allowed_formats: ["jpg", "jpeg", "png", "webp", "xlsx", "docx", "md", "pdf"], // Specify allowed file formats
//   // format: async (req, file) => "png",
//   // public_id: (req, file) => {
//   //   file.fieldname + "-" + Date.now() + path.extname(file.originalname);
//   // },
//   params: (req, file) => {
//     const folderName = "BLog_Ly";
//     const folderPath = `${folderName.trim()}`; // Update the folder path here
//     const fileExtension = path.extname(file.originalname).substring(1);
//     const publicId = `${file.fieldname}-${Date.now()}`;

//     return {
//       folder: folderPath,
//       public_id: publicId,
//       format: fileExtension,
//     };
//   },
// });
const storage3 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Blog_Ly",
    format: async (req, file) => "png",
    public_id: (req, file) => {
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    },
  },
});
const upload = multer({
  storage: storage3,
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename as current timestamp + original filename
  },
});
const upload1 = multer({
  storage: storage1,
});

// Route to handle file upload

function uploadMiddleware(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`; // Update the folder path here
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  });
}
// const upload = uploadMiddleware("Blog_Ly");
router.post("/blog", upload.single("image"), async (req, res, next) => {
  try {
    console.log("hiiii");
    const { title, authorId, content, status, bannerCaption, categoryId } =
      req.body;
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "File or filename is missing" });
    }
    // const filePath = `/${image.destination}/${image.filename}`;
    // console.log(filePath, "fp");
    const newBlog = new BlogLy({
      title,
      authorId,
      content,
      status,
      image: image.path,
      bannerCaption,
      categoryId,
    });

    await newBlog.save();
    console.log(newBlog);

    return res.status(201).json(newBlog);
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json({ error: error.message });
  }
});
// router.post("/upload", async (req, res) => {
//   try {
//     // Check if file was uploaded
//     // if (!req.files || Object.keys(req.files).length === 0) {
//     //   return res.status(400).json({ error: 'No file uploaded' });
//     // }

//     // Access the uploaded file
//     const uploadedFile = req.files.file;

//     // Upload file to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from("YOUR_BUCKET_NAME")
//       .upload(uploadedFile.name, uploadedFile.data);

//     if (error) {
//       console.error("Error uploading file:", error.message);
//       return res.status(500).json({ error: "Failed to upload file" });
//     }

//     // File uploaded successfully, return the URL
//     console.log("File uploaded successfully:", data.Key);
//     return res.json({ success: true, fileUrl: data.Key });
//   } catch (error) {
//     console.error("Error uploading file:", error.message);
//     return res.status(500).json({ error: "Failed to upload file" });
//   }
// });

router.post("/author", async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const capitalizedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const capitalizedLastName =
      lastName.charAt(0).toUpperCase() + lastName.slice(1);
    const addAuthor = new Author({
      firstName: capitalizedFirstName,
      lastName: capitalizedLastName,
    });

    await addAuthor.save();
    console.log(addAuthor);

    return res.status(200).json(addAuthor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/cloudinary-token", (req, res) => {
  // Generate upload token
  const uploadOptions = {
    upload_preset: "dyn8ivzk",
  };

  const uploadParams = cloudinary.uploader.upload_params(uploadOptions);

  // Send token back to frontend
  res.json({ uploadParams });
});
router.get("/cloudinary-preset", (req, res) => {
  // Return the Cloudinary upload preset name
  res.json({ upload_preset: "dyn8ivzk" });
});
// router.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     // Upload file to Cloudinary
//     const file = req.file;
//     console.log(req.file,'---------------')
//     if (!file) {
//       return res.status(400).json({ message: "File or filename is missing" });
//     }
//     const filePath = file.path; // Use req.file.path directly
//     console.log(filePath, "fp");
//     const result = await cloudinary.uploader.upload(filePath);
// console.log(result.secure_url)
//     // Send back the URL of the uploaded file
//     res.json({ url: result.secure_url });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });

router.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({ message: "File or filename is missing" });
    }
    const result = await cloudinary.uploader.upload(file.path);
    console.log(result);
    res.json({ success: 1, file: { url: result.secure_url } });
    // await cloudinary.v2.uploader.upload(file.path,function(res,err){console.log(res,err)});
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
router.post("/api/u", upload1.single("file"), async (req, res) => {
  try {
    // Access the uploaded file using req.file
    const uploadedFile = req.file;
    res.json({
      success: 1,
      file: { url: `http://localhost:7000/${uploadedFile.filename}` },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
router.post("/api/1", upload.single("file"), function (req, response) {
  if (!req.file) {
    return response.status(400).json({ error: "No file uploaded" });
  }

  const uploadedFile = req.file;
  let url = `http://localhost:7000/${uploadedFile.filename}`;

  console.log(url);

  http
    .get(url, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        console.log("start");
        chunks.push(chunk);
      });

      res.on("end", function () {
        console.log("downloaded");
        var jsfile = Buffer.concat(chunks).toString("base64");
        console.log("converted to base64");

        // Send JSON response here after processing is complete
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "X-Requested-With");
        response.header("content-type", "application/pdf");
        response.json({
          success: 1,
          file: {
            url: `data:application/pdf;base64,${jsfile}`, // Embed PDF data directly in URL
          },
        });
      });
    })
    .on("error", function () {
      console.log("error");
      response.status(500).json({ error: "Error downloading PDF" }); // Handle error response
    });
});
router.post("/uploadUrl", upload.single("file"), async (req, res) => {
  try {
    console.log("inn");
    console.log(req.body);
    const { url } = req.body;

    const name = Date.now().toString();
    const imagePath = `public/urls/${name}.jpg`;
    console.log(imagePath);
    const file = fs.createWriteStream(`./${imagePath}`);
    https.get(url, (response) => {
      console.log(response);
      response.pipe(file);

      file.on("finish", () => {
        console.log("Download Complete");
        file.close();
        res.json({
          success: 1,
          file: {
            url: `http://localhost:7000/${imagePath}`,
          },
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
router.use(fileUpload());
// router.post("/upload", async (req, res) => {
//   try {
//     // Check if file was uploaded
//     if (!req.files || !req.files.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
//     console.log(req.files.file, "file heree");
//     // Access the uploaded file
//     const uploadedFile = req.files.file;

//     // Upload file to Supabase Storage
//     let { data, error } = await supabase.storage
//       .from("editor")
//       .upload(uploadedFile.name, uploadedFile);
//     console.log(data, "d");

//     if (error) {
//       if (error.message === "The resource already exists") {
//         if (!data || !data.fullPath) {
//           console.error("Public URL not found in the response");

//         }
//         // Construct public URL
//         const publicUrl = `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`;

//         // File uploaded successfully, return the URL
//         console.log("File uploaded successfully:", publicUrl);
//         return res.json({ success: 1, file: { url: publicUrl } });
//       } else {
//         const publicUrl = `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`;

//         // File uploaded successfully, return the URL
//         return res.json({ success: 1, file: { url: publicUrl } });
//       }
//     } else {
//       return res.json({ success: 1, file: { url: publicUrl } });
//     }
//   } catch (error) {
//     console.error("Error uploading file hm:", error.message);
//     return res.status(500).json({ error: "Failed to upload file" });
//   }
// });
router.post("/upload", async (req, res) => {
  try {
    // Check if file was uploaded
    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(400).json({ error: 'No file uploaded' });
    // }

    // Access the uploaded file
    const uploadedFile = req.files.file;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("editor")
      .upload(uploadedFile.name, uploadedFile.data);
    console.log(data);

    if (error) {
      console.error("Error uploading file:", error.message);
      return res.status(500).json({ error: "Failed to upload file" });
    }
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`;

    // File uploaded successfully, return the URL
    console.log("File uploaded successfully:", publicUrl);
    return res.json({ success: 1, file: { url: publicUrl } });
  } catch (error) {
    console.error("Error uploading file here:", error.message);
    return res.status(500).json({ error: "Failed to upload file" });
  }
});
// router.post("/api/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     // No file was uploaded
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   // File upload successful
//   const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary

//   // Perform any additional logic or save the file URL to a database
//   console.log(fileUrl);
//   res.status(200).json({ success: 1, file: { url: fileUrl } });
// });

router.get("/cloudinary-signature", async (req, res) => {
  try {
    // Generate signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.api_secret
    );
    //f55c39af1414777009ce4de916ceef8aedc4613d
    res.json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    res.status(500).json({ error: "Failed to generate Cloudinary signature" });
  }
});

router.post("/category", async (req, res, next) => {
  try {
    const { categoryName } = req.body;

    const capitalized =
      categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    const addCategory = new Category({
      categoryName: capitalized,
    });

    await addCategory.save();
    console.log(addCategory);

    return res.status(200).json(addCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/author", async (req, res, next) => {
  try {
    const getAuthors = await Author.find({});
    // console.log(getAuthors);
    return res.status(200).json(getAuthors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/blog", async (req, res, next) => {
  try {
    const getBlogs = await BlogLy.find({})
      .populate("authorId")
      .populate("categoryId");
    console.log("getBlogs", getBlogs, getBlogs.length);
    return res.status(200).json(getBlogs);
  } catch (error) {
    return res.status(200).json({ error: error.message });
  }
});
router.get("/title", async (req, res, next) => {
  try {
    const getData = await BlogLy.find({ status: "Publish" })
      .select("title")
      .populate("authorId")
      .populate("categoryId");
    console.log(getData, "titless");
    return res.status(200).json(getData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/title/:id", async (req, res) => {
  try {
    const getData = await BlogLy.findById(req.params.id)
      .populate("categoryId")

      .populate("authorId");
    console.log(getData, "t");
    return res.status(200).json(getData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/category", async (req, res, next) => {
  try {
    const getCategories = await Category.find({});
    // console.log(getCategories);
    return res.status(200).json(getCategories);
  } catch (error) {
    return res.status(200).json({ error: error.message });
  }
});
router.get("/userblogs", async (req, res, next) => {
  try {
    const userBlogs = await BlogLy.find({ status: "Publish" });
    console.log(userBlogs);
    return res.status(200).json(userBlogs);
  } catch (error) {}
});

module.exports = router;

import { useState, useContext, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import PropTypes from "prop-types";
import { UpdateContext } from "../../contexts/UpdateContext";
import CKEditor from "../../components/CKeditor";
import getCurrentDate from "../../utils/getCurrentDataFunction";
import formatDate from "../../utils/FomatDatafunction";
import Loading from "../../components/Loading";
import convertDateFormat from "../../utils/ConvertDateFormat";
const UpdateBlog = ({ blogCategoryList, authorList }) => {
  const { id: blogParams } = useParams();

  // state
  const [blog, setBlog] = useState({
    title: null,
    coverImage: null,
    description: "",
    content: "",
    publicationDate: getCurrentDate(),
    isActive: "true",
    categoryId: "",
    authorId: "default",
  });
  const [oldImageUrl, setOldImageUrl] = useState(null);
  let navigate = useNavigate();

  //   update context
  const { setIsUpdated } = useContext(UpdateContext);

  //   handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "coverImage") {
      setBlog({
        ...blog,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  //   hadle onChange event for CKEditor
  const handleEditorChange = (content) => {
    setBlog({
      ...blog,
      content: content,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "blogs", blogParams);

    // fetch a field of data from firebase by blogParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          // check if the author no longer exist
          let authorId = "default"; //set to default id (admin)

          authorList.forEach((element) => {
            if (element.id === data.authorId) {
              authorId = data.authorId;
              return;
            }
          });

          setBlog({
            title: data.title,
            description: data.description,
            content: data.content,
            coverImageId: data.coverImageId,
            publicationDate: convertDateFormat(data.publicationDate),
            categoryId: data.categoryId,
            authorId: authorId,
            isActive: data.isActive,
            // no need to set cover image, set it as null to check if it is updated or not
            coverImage: null,
          });

          // get old image url
          setOldImageUrl(data.coverImage);
          console.log("data", data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [blogParams, authorList]);

  // --------------------------------
  //   update blog if all required fields are filled
  async function updateBlog() {
    // navigate to blog detail page in advance
    navigate("/blogDetail/" + blogParams);

    const docRef = doc(db, "blogs", blogParams);

    // if image is not updated
    if (blog.coverImage === null) {
      await setDoc(
        docRef,
        {
          title: blog.title,
          description: blog.description,
          content: blog.content,
          coverImage: oldImageUrl,
          coverImageId: blog.coverImageId,
          publicationDate: formatDate(blog.publicationDate),
          categoryId: blog.categoryId,
          authorId: blog.authorId,
          // convert string to boolean because the value we get from the select form is string.
          isActive:
            typeof blog.isActive === "string"
              ? JSON.parse(blog.isActive.toLowerCase())
              : blog.isActive,
          blog: blog.categoryId,
        },
        { merge: true }
      );
      // to update the data in the table
      setIsUpdated((prev) => !prev);
    } else {
      alert("image is updated");
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `blogCoverImages/${blog.coverImageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(blog.title, "blog cover image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `blogCoverImages/${blog.coverImageId}`);
      uploadBytes(imageRef, blog.coverImage).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("blog new cover image URL:", downloadURL);
            // update data in the firestore with a new image url and new data
            updateBlogAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new product image uploaded");
      });
    }

    console.log("product updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateBlog function because we need to get the new image url first
  async function updateBlogAndNewImage(newImageUrl) {
    const docRef = doc(db, "blogs", blogParams);
    await setDoc(
      docRef,
      {
        title: blog.title,
        description: blog.description,
        content: blog.content,
        coverImage: newImageUrl,
        coverImageId: blog.coverImageId,
        publicationDate: formatDate(blog.publicationDate),
        categoryId: blog.categoryId,
        authorId: blog.authorId,
        // convert string to boolean because the value we get from the select form is string.
        isActive:
          typeof blog.isActive === "string"
            ? JSON.parse(blog.isActive.toLowerCase())
            : blog.isActive,
      },
      { merge: true }
    );
    // to update the data in the table
    setIsUpdated((prev) => !prev);
  }

  // --------------------------------
  // loading until data is fetched
  if (blog.title === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 mt-6 rounded">
        {/* title */}
        <div className="text-center p-4 font-bold text-3xl text-violet-600 underline uppercase">
          Update Blog Post
        </div>
        <br />

        {/* create blog categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* blog name input */}
            <div className="w-full">
              <label className="font-bold text-xl">Blog Title:</label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="title"
                value={blog.title}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* category input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Category</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="categoryId"
                  value={blog.categoryId}
                  onChange={(e) => handleOnChange(e)}
                >
                  {blogCategoryList.map((data) => (
                    <>
                      <option value={data.id}>{data.categoryName}</option>
                    </>
                  ))}
                </select>
              </div>

              {/* author input*/}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Author</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="authorId"
                  value={blog.authorId}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value={`default`}>Admin</option>
                  {authorList.map((data) => (
                    <>
                      <option value={data.id}>{data.fullName}</option>
                    </>
                  ))}
                </select>
              </div>
              {/* isActive input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Status</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="isActive"
                  value={blog.isActive}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value={true}>Enable</option>
                  <option value={false}>Disable</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* blog image url input */}
              <div className="w-full">
                <label className="font-bold text-xl">Cover Image:</label>
                <input
                  className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
                  type="file"
                  name="coverImage"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              {/* publish date */}
              <div className="w-full">
                <label className="font-bold text-xl ">Publish Date</label>
                <input
                  type="date"
                  name="publicationDate"
                  className="border border-gray-700  uppercase p-2 rounded w-full outline-none mb-5 cursor-pointer "
                  value={blog.publicationDate}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            {/* description input */}
            <label className="font-bold text-xl">Description:</label>
            <textarea
              placeholder="Write something to describe this blog "
              rows={3}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="description"
              value={blog.description}
              onChange={(e) => handleOnChange(e)}
            />

            {/* blog Content or body input */}
            <label className="font-bold text-xl">Content:</label>
            <div>
              <CKEditor
                handleEditorChange={handleEditorChange}
                contentToUpdate={blog.content}
              />
            </div>

            {/*create blog button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                // check if all required input is filled
                blog.title && blog.description && blog.content
                  ? updateBlog
                  : notify
              }
            >
              Update Blog
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />
      </div>
    </Layout>
  );
};
UpdateBlog.propTypes = {
  blogCategoryList: PropTypes.array.isRequired,
  authorList: PropTypes.array.isRequired,
};
export default UpdateBlog;
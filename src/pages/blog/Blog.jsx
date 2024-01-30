import Layout from "../../layouts/Layout";
import { useContext } from "react";
import { Link } from "react-router-dom";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Toast from "../../utils/Toast";
import { toastProps } from "../../utils/ToastProps";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { UpdateContext } from "../../contexts/UpdateContext";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase-config";
import LoadingInTable from "../../components/LoadingInTable";
const Blog = ({ blogList, blogCategoryList, authorList }) => {
  const { setIsUpdated } = useContext(UpdateContext);

  // delete Blog notify
  const notifyDeleting = (id, coverImageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "blogs")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(coverImageId);
                }
              }) // This will log true if the item was deleted successfully
              .catch((error) => console.error(error));
          }}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  const deleteImageFromStorage = (coverImageId) => {
    // delete image from firebase storage
    const storageRef = ref(storage, `blogCoverImages/${coverImageId}`);
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("blog cover image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  return (
    <Layout>
      <TableHead
        color="rgb(124,58,237)"
        title="Blogs"
        border="border-violet-600 text-violet-600"
        link="/createBlog"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {blogList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                    <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {blogList.map((blog, index) => (
                <>
                  <tr
                    key={Blog.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 ">{blog.title}</td>

                    <td className="px-4 py-3">
                      {blogCategoryList &&
                        blogCategoryList.map((data) => {
                          if (data.id == blog.categoryId) {
                            return data.categoryName;
                          }
                        })}
                    </td>
                    <td className="px-4 py-3">
                      {blog.authorId.toLowerCase() === "default"
                        ? "Admin"
                        : authorList &&
                          authorList.map((data) => {
                            if (data.id == blog.authorId) {
                              return data.fullName;
                            }
                          })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {blog.publicationDate}
                    </td>
                    <td className="px-4 py-3">
                      {blog.isActive ? "Enable" : "Disable"}
                    </td>
                    <td className="px-4 py-3">
                      {blog.coverImage ? (
                        <img
                          className="min-w-[70px] h-[50px] rounded-sm"
                          src={blog.coverImage}
                          loading="lazy"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <Link to={`/blogDetail/${blog.id}`}>
                        <div className="px-2 py-1.5 rounded bg-yellow-500 text-white cursor-pointer">
                          View
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-sm text-center">
                      <Link to={`/updateBlog/${blog.id}`}>
                        <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                          Edit
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-sm text-center cursor-pointer">
                      <div
                        onClick={() =>
                          notifyDeleting(blog.id, blog.coverImageId)
                        }
                        className="px-2 py-1.5 rounded bg-red-600 text-white"
                      >
                        Delete
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
      </div>

      {/* toast alert */}
      <Toast />
    </Layout>
  );
};
Blog.propTypes = {
  blogList: PropTypes.array.isRequired,
  blogCategoryList: PropTypes.array.isRequired,
  authorList: PropTypes.array.isRequired,
};
export default Blog;

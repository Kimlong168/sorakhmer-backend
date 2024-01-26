import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PropTypes from "prop-types";
import "../App.css";
import { useEffect, useState } from "react";
const CKeditor = ({ handleEditorChange, contentToUpdate }) => {
  const [content, setContent] = useState(contentToUpdate || "");

  useEffect(() => {
    handleEditorChange(content);
  }, [content, handleEditorChange]);

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("file", file);

            const imageRef = ref(storage, `blogImages/${file.name}`);
            uploadBytes(imageRef, file).then(() => {
              // Get the download URL for the uploaded image
              getDownloadURL(imageRef)
                .then((downloadURL) => {
                  console.log("profile image URL:", downloadURL);
                  // resolve the promise with the result object
                  resolve({
                    default: downloadURL,
                  });
                })
                .catch((error) => {
                  reject(error);
                  console.error("Error getting download URL:", error);
                });
              console.log("blog image uploaded");
            });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div>
      <CKEditor
        className="editor"
        config={{
          extraPlugins: [uploadPlugin],
        }}
        editor={ClassicEditor}
        data={content}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
};
CKeditor.propTypes = {
  handleEditorChange: PropTypes.func.isRequired,
  contentToUpdate: PropTypes.string.isRequired,
};
export default CKeditor;
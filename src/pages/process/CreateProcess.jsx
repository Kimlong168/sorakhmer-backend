import { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import CKeditor from "../../components/CKeditor";
import RedStar from "../../components/RedStar";

const CreateProcess = () => {
  const [process, setProcess] = useState({
    processName: null,
    description: "",
  });
  let navigate = useNavigate();
  const postCollectionRef = collection(db, "process");

  //   update context
  const { setIsUpdated } = useContext(UpdateContext);

  //   handle onChange event for input
  const handleOnChange = (e) => {
    setProcess({
      ...process,
      [e.target.name]: e.target.value,
    });
  };

  //   hadle onChange event for CKEditor
  const handleEditorChange = (content) => {
    setProcess({
      ...process,
      description: content,
    });
  };

  //   create category fucntion
  const createCategory = () => {
    addDoc(postCollectionRef, {
      processName: process.processName,
      description: process.description,
    });

    console.log("process category created!", process.processName);
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    navigate("/process");
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-blue-900 underline uppercase">
          Create Process
        </div>
        <br />

        {/* create product categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* category name input */}
            <label className="font-bold text-xl">Process Name<RedStar /></label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              placeholder="example: Sora khmer"
              type="text"
              name="processName"
              value={process.processName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* description input */}
            <label className="font-bold text-xl">Description<RedStar /></label>
            <div>
              <CKeditor
                handleEditorChange={handleEditorChange}
                imageFolderName="processImages"
              />
            </div>

            {/*check if categoryName is not filled yet. */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                process.processName && process.description
                  ? createCategory
                  : notify
              }
            >
              Create process
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />
      </div>
    </Layout>
  );
};

export default CreateProcess;

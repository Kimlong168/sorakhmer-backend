import { useEffect, useState, useContext } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { useParams } from "react-router-dom";
import { UpdateContext } from "../../contexts/UpdateContext";
import Loading from "../../components/Loading";
import CKeditor from "../../components/CKeditor";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack"
const UpdateProcess = () => {
  const { id: processParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const [process, setProcess] = useState({
    processName: null,
    description: "",
  });

  let navigate = useNavigate();

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

  useEffect(() => {
    const docRef = doc(db, "process", processParams);

    // fetch a field of data from firebase by processParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);
          setProcess({
            processName: data.processName,
            description: data.description,
          });
          console.log("data", data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [processParams]);

  //   update category if all required fields are filled
  async function updateProcess() {
    const docRef = doc(db, "process", processParams);
    await setDoc(
      docRef,
      {
        processName: process.processName,
        description: process.description,
      },
      { merge: true }
    );

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    navigate("/process");
    console.log("process of producing updated");
  }

  // loading until data is fetched
  if (process.processName === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-900 mt-6 rounded">
        {/* title */}
        <div className="text-center p-4 font-bold text-3xl text-pink-600 underline uppercase">
          Update Process
        </div>
        <br />
        {/* update form */}
        <section className="pt-0">
          {/* category name */}
          <label className="font-bold text-xl">
            Process Name
            <RedStar />
          </label>
          <input
            type="text"
            name="processName"
            placeholder="Title eg(CPL, Laliga, EPL, AFC-Cup,...)"
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            value={process.processName}
            onChange={(e) => handleOnChange(e)}
          />

          {/* description input */}
          <label className="font-bold text-xl">
            Description
            <RedStar />
          </label>
          <div>
            <CKeditor
              handleEditorChange={handleEditorChange}
              contentToUpdate={process.description}
              imageFolderName="processImages"
            />
          </div>

          {/* update button */}
          <button
            className="bg-gray-700 w-full  text-white font-bold p-2 mt-2 rounded"
            onClick={
              process.processName && process.description
                ? updateProcess
                : notify
            }
          >
            Update Category
          </button>

          {/* toast alert */}
          <Toast />
          
            {/* button back */}
            <ButtonBack link="/process"/>
        </section>
      </div>
    </Layout>
  );
};

export default UpdateProcess;

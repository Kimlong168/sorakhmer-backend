import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Loading from "../../components/Loading";
import ContentDisplay from "../../components/ContentDisplay";
import { IoChevronBack } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";

const ProcessDetail = () => {
  const { id: processParams } = useParams();
  const [process, setProcess] = useState(null);

  // fetch product base on id or processParams
  useEffect(() => {
    const docRef = doc(db, "process", processParams);

    const fetchProduct = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const process = docSnap.data();

          setProcess(process);

          console.log("process", process);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchProduct();
  }, [processParams]);

  // loading if product is null
  if (!process) {
    return (
      <>
        <Layout>
          <Loading />
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      {/* button back and edit */}
      <div className="flex items-center gap-2 fixed">
        <div>
          <Link to="/process">
            <button className="px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-red-600 flex gap-3 justify-center items-center">
              <IoChevronBack /> Back
            </button>
          </Link>
        </div>
        <div>
          <Link to={`/updateProcess/${processParams}`}>
            <button className="px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-green-600 flex gap-3 justify-center items-center">
              <FiEdit /> Edit
            </button>
          </Link>
        </div>
      </div>
      {/* content */}
      <div className="pt-[50px]">
        <div className="prose lg:prose-xl prose-img:w-full lg:prose-img:w-auto lg:prose-img:mx-auto lg:prose-img:block prose-a:text-blue-600 prose-a:hover:text-blue-400 rounded mx-auto bg-gray-100 border w-full font-khmer p-2 md:p-5">
          <h2>
            Process of producing{" "}
            <span className="text-pink-500">{process.processName}</span>
          </h2>
          <hr />
          <div>Description:</div>
          {/* Use dangerouslySetInnerHTML to render HTML content */}
          <ContentDisplay htmlString={process.description} />
        </div>
      </div>
    </Layout>
  );
};

export default ProcessDetail;

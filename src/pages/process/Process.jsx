import { Link } from "react-router-dom";
import { useContext } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import Toast from "../../utils/Toast";
import { toast } from "react-toastify";
import { toastProps } from "../../utils/toastProp";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
const Process = () => {
  const { processList, setShowNotification } =
    useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);
  // delete category notify
  const notifyDeleting = (id) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            const confirm = deleteItemFucntion(id, "process");

            if (confirm) {
              setShowNotification({
                status: true,
                item: "process",
                action: "deleted",
              });
            }
          }}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  return (
    <Layout>
      <TableHead
        color="rgb(30,58,138)"
        title={`Process (${processList.length})`}
        border="border-blue-900 text-blue-900"
        link="/createProcess"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3 w-full">Process Name</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {processList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold" colSpan={8}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {processList.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">{item.processName}</td>
                  {/* edit button */}
                  <td className="px-4 py-3 text-sm text-center">
                    <Link to={`/processDetail/${item.id}`}>
                      <div className="px-2 py-1.5 rounded bg-yellow-500 text-white">
                        View
                      </div>
                    </Link>
                  </td>

                  {/* edit button */}
                  <td className="px-4 py-3 text-sm text-center">
                    <Link to={`/updateProcess/${item.id}`}>
                      <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                        Edit
                      </div>
                    </Link>
                  </td>

                  {/* delete button */}
                  <td className="px-4 py-3 text-sm text-center cursor-pointer">
                    <div
                      onClick={() => notifyDeleting(item.id)}
                      className="px-2 py-1.5 rounded bg-red-600 text-white"
                    >
                      Delete
                    </div>
                  </td>
                </tr>
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

export default Process;

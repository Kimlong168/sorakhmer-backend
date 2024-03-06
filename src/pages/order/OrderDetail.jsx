import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Loading from "../../components/Loading";
import OrderDetailCard from "../../components/OrderDetailCard";

const OrderDetail = () => {
  const { id: orderParams } = useParams();
  const [order, setOrder] = useState(null);

  // fetch order base on id or orderParams
  useEffect(() => {
    const docRef = doc(db, "orders", orderParams);
    const fetchorder = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const order = docSnap.data();

          setOrder(order);

          console.log("orders", order);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchorder();
  }, [orderParams]);

  // loading if order is null
  if (!order) {
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
      <div>
        {/* order detail card component */}
        <OrderDetailCard {...order} />
      </div>
    </Layout>
  );
};

export default OrderDetail;

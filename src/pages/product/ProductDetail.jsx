import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Loading from "../../components/Loading";
import PropTypes from "prop-types";
import DetailProductCard from "../../components/DetailProductCard";

const ProductDetail = ({ productCategoryList }) => {
  const { id: productParams } = useParams();
  const [product, setproduct] = useState(null);

  // fetch product base on id or productParams
  useEffect(() => {
    const docRef = doc(db, "products", productParams);

    const fetchProduct = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const product = docSnap.data();

          setproduct(product);

          console.log("product", product);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchProduct();
  }, [productParams]);

  // loading if product is null
  if (!product) {
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
        {/* product detail card component */}
        <DetailProductCard
          {...product}
          productParams={productParams}
          productCategoryList={productCategoryList}
        />
      </div>
    </Layout>
  );
};
ProductDetail.propTypes = {
  productCategoryList: PropTypes.array.isRequired,
};

export default ProductDetail;

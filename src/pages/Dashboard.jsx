import Layout from "../layouts/Layout";
import WidgetGroup from "../components/WidgetGroup";
import Box from "../components/CardGroup";

const Dashboard = () => {
  return (
    <Layout>
      <div>
        <Box />
        <p className="text-xl font-semibold my-2">Create</p>
        <WidgetGroup />
      </div>
    </Layout>
  );
};

export default Dashboard;

const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-500";
      case "processing":
        return "bg-blue-600";
      case "shipped":
        return "bg-green-600";
      case "delivered":
        return "bg-pink-600";
      case "canceled":
        return "bg-red-600";
      default:
        return "bg-gray-700";
    }
  };

export default getStatusColor;
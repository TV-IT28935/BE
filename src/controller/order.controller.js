const createOrder = async (req, res) => {};
const getOrderById = async (req, res) => {};
const getOrderDetailByOrderId = async (req, res) => {};
const getAllOrderStatus = async (req, res) => {
    try {
        console.log("xxxxxxxxxxxxxxx");
    } catch (error) {}
};
const getAllOrder = async (req, res) => {};
const cancelOrder = async (req, res) => {};
const countOrderByName = async (req, res) => {};
const countOrder = async (req, res) => {};
const reportAmountYear = async (req, res) => {};
const reportByProduct = async (req, res) => {};
const getOrderByOrderStatusAndYearAndMonth = async (req, res) => {};
const getOrderByProduct = async (req, res) => {};
const reportAmountMonth = async (req, res) => {};
const updateOrder = async (req, res) => {};
const updateCancel = async (req, res) => {};
const updateProcess = async (req, res) => {};
const updateShip = async (req, res) => {};
const updateSuccess = async (req, res) => {};
const getAllOrderAndPagination = async (req, res) => {};
const getOrderByOrderStatusBetweenDate = async (req, res) => {};
const getAllOrdersByPayment = async (req, res) => {};

export {
    cancelOrder,
    countOrder,
    countOrderByName,
    createOrder,
    getAllOrder,
    getAllOrderAndPagination,
    getAllOrdersByPayment,
    getAllOrderStatus,
    getOrderById,
    getOrderByOrderStatusAndYearAndMonth,
    getOrderByOrderStatusBetweenDate,
    getOrderByProduct,
    getOrderDetailByOrderId,
    reportAmountMonth,
    reportAmountYear,
    reportByProduct,
    updateCancel,
    updateOrder,
    updateProcess,
    updateShip,
    updateSuccess,
};

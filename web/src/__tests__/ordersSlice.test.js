import ordersReducer, {
  fetchOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  optimisticStatusUpdate,
} from "../redux/slices/ordersSlice";

describe("Orders Slice", () => {
  const initialState = {
    list: [],
    status: "idle",
    error: null,
    operationError: null,
  };

  it("returns initial state", () => {
    expect(ordersReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("optimistic updates", () => {
    it("optimistically updates order status", () => {
      const currentState = {
        list: [
          { id: 1, customer_name: "John", status: "pending" },
          { id: 2, customer_name: "Jane", status: "shipped" },
        ],
        status: "idle",
        error: null,
        operationError: null,
      };

      const action = optimisticStatusUpdate({ id: 1, status: "shipped" });
      const newState = ordersReducer(currentState, action);

      expect(newState.list[0].status).toBe("shipped");
      expect(newState.list[1].status).toBe("shipped");
    });
  });

  describe("async thunks", () => {
    it("handles fetchOrders.pending", () => {
      const action = { type: fetchOrders.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.status).toBe("loading");
    });

    it("handles fetchOrders.fulfilled", () => {
      const orders = [
        { id: 1, customer_name: "John", status: "pending", total: 99.99 },
        { id: 2, customer_name: "Jane", status: "shipped", total: 249.99 },
      ];
      const action = {
        type: fetchOrders.fulfilled.type,
        payload: orders,
      };

      const newState = ordersReducer(initialState, action);

      expect(newState.status).toBe("succeeded");
      expect(newState.list).toEqual(orders);
    });

    it("handles addOrder.fulfilled", () => {
      const currentState = {
        list: [{ id: 1, customer_name: "John", status: "pending" }],
        status: "idle",
        error: null,
        operationError: null,
      };
      const newOrder = { id: 2, customer_name: "Jane", status: "pending" };
      const action = {
        type: addOrder.fulfilled.type,
        payload: newOrder,
      };

      const newState = ordersReducer(currentState, action);

      expect(newState.list.length).toBe(2);
      expect(newState.list[0]).toEqual(newOrder);
    });

    it("handles updateOrderStatus.fulfilled", () => {
      const currentState = {
        list: [{ id: 1, customer_name: "John", status: "pending" }],
        status: "idle",
        error: null,
        operationError: null,
      };
      const updatedOrder = { id: 1, customer_name: "John", status: "shipped" };
      const action = {
        type: updateOrderStatus.fulfilled.type,
        payload: updatedOrder,
      };

      const newState = ordersReducer(currentState, action);

      expect(newState.list[0].status).toBe("shipped");
    });

    it("handles deleteOrder.fulfilled", () => {
      const currentState = {
        list: [
          { id: 1, customer_name: "John", status: "pending" },
          { id: 2, customer_name: "Jane", status: "shipped" },
        ],
        status: "idle",
        error: null,
        operationError: null,
      };
      const action = {
        type: deleteOrder.fulfilled.type,
        payload: 1,
      };

      const newState = ordersReducer(currentState, action);

      expect(newState.list.length).toBe(1);
      expect(newState.list[0].id).toBe(2);
    });
  });
});

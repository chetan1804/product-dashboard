import productsReducer, {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  optimisticUpdate,
  optimisticAdd,
  optimisticDelete,
} from "../redux/slices/productsSlice";

describe("Products Slice", () => {
  const initialState = {
    list: [],
    status: "idle",
    error: null,
    operationError: null,
  };

  it("returns initial state", () => {
    expect(productsReducer(undefined, { type: "@@INIT" })).toEqual(
      initialState
    );
  });

  describe("optimistic updates", () => {
    it("optimistically updates a product", () => {
      const currentState = {
        list: [
          { id: 1, title: "Laptop", price: 999.99 },
          { id: 2, title: "Mouse", price: 29.99 },
        ],
        status: "idle",
        error: null,
        operationError: null,
      };

      const updated = { id: 1, title: "Laptop Pro", price: 1299.99 };
      const newState = productsReducer(currentState, optimisticUpdate(updated));

      expect(newState.list[0]).toEqual(updated);
      expect(newState.list[1]).toEqual(currentState.list[1]);
    });

    it("optimistically adds a product", () => {
      const product = { title: "Keyboard", price: 79.99 };
      const newState = productsReducer(initialState, optimisticAdd(product));

      expect(newState.list.length).toBe(1);
      expect(newState.list[0]).toMatchObject(product);
    });

    it("optimistically deletes a product", () => {
      const currentState = {
        list: [
          { id: 1, title: "Laptop", price: 999.99 },
          { id: 2, title: "Mouse", price: 29.99 },
        ],
        status: "idle",
        error: null,
        operationError: null,
      };

      const newState = productsReducer(currentState, optimisticDelete(1));

      expect(newState.list.length).toBe(1);
      expect(newState.list[0].id).toBe(2);
    });
  });

  describe("async thunks", () => {
    it("handles fetchProducts.pending", () => {
      const action = { type: fetchProducts.pending.type };
      const newState = productsReducer(initialState, action);

      expect(newState.status).toBe("loading");
    });

    it("handles fetchProducts.fulfilled", () => {
      const products = [
        { id: 1, title: "Laptop", price: 999.99 },
        { id: 2, title: "Mouse", price: 29.99 },
      ];
      const action = {
        type: fetchProducts.fulfilled.type,
        payload: products,
      };

      const newState = productsReducer(initialState, action);

      expect(newState.status).toBe("succeeded");
      expect(newState.list).toEqual(products);
    });

    it("handles fetchProducts.rejected", () => {
      const action = {
        type: fetchProducts.rejected.type,
        error: { message: "Failed to fetch" },
      };

      const newState = productsReducer(initialState, action);

      expect(newState.status).toBe("failed");
      expect(newState.error).toBe("Failed to fetch");
    });

    it("handles addProduct.fulfilled", () => {
      const currentState = {
        list: [{ id: 1, title: "Laptop", price: 999.99 }],
        status: "idle",
        error: null,
        operationError: null,
      };
      const newProduct = { id: 2, title: "Mouse", price: 29.99 };
      const action = {
        type: addProduct.fulfilled.type,
        payload: newProduct,
        meta: { arg: { tempId: undefined } },
      };

      const newState = productsReducer(currentState, action);

      expect(newState.list.length).toBe(2);
      expect(newState.list[0]).toEqual(newProduct);
    });

    it("handles deleteProduct.fulfilled", () => {
      const currentState = {
        list: [
          { id: 1, title: "Laptop", price: 999.99 },
          { id: 2, title: "Mouse", price: 29.99 },
        ],
        status: "idle",
        error: null,
        operationError: null,
      };
      const action = {
        type: deleteProduct.fulfilled.type,
        payload: 1,
      };

      const newState = productsReducer(currentState, action);

      expect(newState.list.length).toBe(1);
      expect(newState.list[0].id).toBe(2);
    });
  });
});

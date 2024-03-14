import { create } from "zustand";
import { combine } from "zustand/middleware";

interface ITaskCreatorState {
  showModal: boolean;
}
const initialState: ITaskCreatorState = {
  showModal: true,
};

const useTaskCreator = create(
  combine(initialState, (set, get) => ({
    setShowModal: (payload: boolean) => {
      set({
        showModal: payload,
      });
    },
  }))
);

export default useTaskCreator;

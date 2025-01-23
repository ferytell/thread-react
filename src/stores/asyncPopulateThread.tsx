import { fetchThreads, fetchThreadById } from "./threadSlice";
import { useParams } from "react-router-dom";

function asyncPopulateThread() {
  return async (dispatch: any) => {
    try {
      const { id } = useParams<{ id: string | undefined }>();

      dispatch(fetchThreads());
      dispatch(fetchThreadById(id));
    } catch (error) {
      alert(error);
    }
  };
}

export { asyncPopulateThread };

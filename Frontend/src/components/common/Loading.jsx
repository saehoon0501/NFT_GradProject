import LoadingSpinner from "../../assets/LoadingSpinner.svg";
import "./Loading.css";

export const Loading = () => {
  return (
    <div className="loading_wrapper">
      <img src={LoadingSpinner} alt="Loading Spinner" />
    </div>
  );
};

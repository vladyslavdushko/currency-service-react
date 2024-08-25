import { useDispatch } from "react-redux";
import styles from "./Filter.module.css";
import { setFilter } from "reduxState/filter/filterSlice";
export const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setFilter(e.target.value.toLowerCase()));
  };

  return (
    <input
      placeholder="What currency are you looking for?🧐"
      className={styles.input}
      type="text"
      onChange={handleChange}
    />
  );
};

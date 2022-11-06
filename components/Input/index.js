// styles
import styles from "./index.module.scss";

const Input = (props) => {
  const { value, placeholder, onChange } = props;

  return (
    <input
      className={styles.container}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default Input;

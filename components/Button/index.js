// styles
import styles from "./index.module.scss";

const Button = (props) => {
  const {
    label,
    onClick,
    backgroundColor = "#666666",
    height = "50px",
  } = props;
  return (
    <button
      onClick={() => onClick()}
      className={styles.container}
      style={{ backgroundColor: backgroundColor, height: height }}
    >
      {label}
    </button>
  );
};

export default Button;

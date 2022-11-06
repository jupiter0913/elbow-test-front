// styles
import styles from "./index.module.scss";

const Button = (props) => {
  const { label, onClick, backgroundColor = "", height = "" } = props;
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

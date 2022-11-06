// styles
import styles from "./index.module.scss";

const Button = (props) => {
  const { label, onClick } = props;
  return (
    <button onClick={() => onClick()} className={styles.container}>
      {label}
    </button>
  );
};

export default Button;

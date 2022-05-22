import "./Card.css";

const Card = (props) => {
  // 可以加上個字要套用的樣式，提供更多彈性
  const classes = "card " + props.className;
  return <div className={classes}>{props.children}</div>;
};

export default Card;
